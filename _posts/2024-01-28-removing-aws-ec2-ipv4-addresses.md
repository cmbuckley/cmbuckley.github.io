---
title: Removing AWS EC2 IPv4 Addresses
categories:
  - Computing
image:
  meta:
    src: /files/2024/01/eic.png
    alt: User connecting to an EC2 instance via an EIC endpoint
last_modified_at: 2025-08-02 20:46 +00:00
---

In July 2023, [AWS announced they will charge for IPv4 addresses][1] starting 1&nbsp;February 2024. The new charge will be the same as the existing charge for an idle IP: $0.005 per hour; slightly over $40 per year per IP address. If you're running some small T2 or T3 instances for general-purpose workloads, this could increase your monthly cost somewhere between 20--40%. The EC2 free tier will include 750 hours of usage for 12 months, so a single IPv4 address should be pretty much free for that time, but if you've exhausted the free tier or have multiple IP addresses, this charge will start to appear very soon.

# Caveats

Firstly, there are a few reasons why this might not be worthwhile/beneficial/possible:

* Load balancer / NAT gateway
* No outbound IPv4 access - this is likely to be the biggie. Without using a NAT gateway or other

AWS CLI - STS and others
GitHub! (though hopefully changing soon)

I use a t2.micro instance as a sandbox environment, which allows HTTPS and SSH access. This has a public IPv4 address, so we need to add some IPv6 addresses to this instance. I'm using Terraform to define the infrastructure so I followed [Mattias Holmlund's post][2] to set up IPv6:

```diff
 resource "aws_vpc" "default" {
+  assign_generated_ipv6_cidr_block = true
 }

 resource "aws_subnet" "public" {
   vpc_id                          = aws_vpc.default.id
   map_public_ip_on_launch         = true
+  assign_ipv6_address_on_creation = true
+  ipv6_cidr_block                 = cidrsubnet(aws_vpc.default.ipv6_cidr_block, 8, 0)
   cidr_block                      = cidrsubnet(aws_vpc.default.cidr_block, 4, 0)
 }

 resource "aws_security_group_rule" "ingress_https" {
   security_group_id = aws_security_group.default.id
   type              = "ingress"
   protocol          = "tcp"
   from_port         = 443
   to_port           = 443
   cidr_blocks       = ["0.0.0.0/0"]
+  ipv6_cidr_blocks  = ["::/0"]
 }
+
+resource "aws_route" "default_ipv6" {
+  route_table_id              = aws_route_table.default.id
+  destination_ipv6_cidr_block = "::/0"
+  gateway_id                  = aws_internet_gateway.default.id
+}
```

This is a development server, but because I tend to have a few unformed ideas on the go, it's definitely more "pet" than "cattle" from an infrastructure perspective. Because I wanted to add an IPv6 address without destroying/replacing the instance, I also had to follow [Colin Barker's advice][3] to add the address and import the primary ENI into Terraform state:

```
resource "aws_network_interface" "primary" {
  subnet_id       = aws_subnet.public.id
  security_groups = [aws_security_group.default.id]

  private_ip_list_enabled   = false

  attachment {
    instance     = aws_instance.sandbox.id
    device_index = 1
  }
}
```

```bash
terraform import aws_network_interface.temp $(
    aws ec2 describe-network-interfaces \
    --query 'NetworkInterfaces[*].{NetworkInterfaceId: NetworkInterfaceId}' \
    --output text)
```

After this I added the IPv6 addresses to the EC2 instance:

```diff
 resource "aws_instance" "sandbox" {
   associate_public_ip_address = true
+  ipv6_addresses              = [cidrhost(aws_subnet.public.ipv6_cidr_block, 16)]
 }
```

And finally remove the ENI from Terraform:

```bash
terraform state rm aws_network_interface.temp
```

I use Cloudflare in front of most services, including this development server, so HTTPS traffic can now use the IPv6 address, and the Cloudflare gateway will provide an IPv4 ingress point for IPv4-only clients. However, SSH traffic isn't proxied, and I allow SSH ingress from certain locations that don't support IPv6, including a break-glass mechanism to access from anywhere. So we still need IPv4!

When AWS announced the IPv4 charges, they also launched [EC2 Instance Connect (EIC) endpoint][4] which can be used to tunnel traffic to EC2 instances. The best part is this EIC endpoint is completely free, though make sure to set it up in the same subnet as the EC2 instance to avoid data transfer costs.

{% include figure.html object="/files/2024/01/eic.svg" figsize="large" caption="User connecting to an EC2 instance via an EIC endpoint." alt="An AWS architecture showing an authenticated user connecting to an EC2 instance via the EIC service. The instance is in a public subnet with an EIC endpoint." %}

The first step is to create the resource:

```hcl
resource "aws_ec2_instance_connect_endpoint" "public" {
  subnet_id = aws_subnet.public.id
}
```


Now, I want to be able to SSH to this instance as easily as I normally do, using existing keys, without storing any long-lived AWS credentials anywhere. I already use IAM Identity Center, so I can create a profile using the AWS CLI, but first I need a specific permission set for this. At Answer Digital, we [created an SSO account assignment module][5] that makes this easy:

```hcl
locals {
  accounts = {
    for account in aws_organizations_organization.myorg.accounts
    : account.name => account.id
  }
}

data "aws_iam_policy_document" "ec2_instance_connect" {
  statement {
    actions = [
      "ec2:DescribeInstances",
      "ec2:DescribeInstanceConnectEndpoints",
      "ec2-instance-connect:*",
    ]

    resources = ["*"]
  }
}

module "iam_myorg" {
  source = "github.com/answerdigital/terraform-modules//modules/aws/sso_account_assignment?ref=v4"

  # Create roles and policies
  permission_sets = {
    EC2InstanceConnect = {
      inline_policy = data.aws_iam_policy_document.ec2_instance_connect.json
    }
  }

  # Mapping between groups, accounts and roles
  assignments = {
    "admins" = [{
      account_ids     = [local.accounts.Sandbox]
      permission_sets = ["EC2InstanceConnect"]
    }]
  }
}
```

Now, I can use `aws configure sso` to create my profile, or add the following to my `~/.aws/config`:

```ini
[profile ssh]
sso_session = mysession
sso_account_id = XXXXXXXXXXXX
sso_role_name = EC2InstanceConnect
region = xx-xxxx-x

[sso-session mysession]
sso_start_url = https://myorg.awsapps.com/start/
sso_region = yy-yyyy-y
sso_registration_scopes = sso:account:access
```

Now if I run `aws sso login --profile ssh`, I will be prompted to sign in using SSO and grant "botocore-client-mysession" access. The default session length is 1 hour, but you can alter this per PermissionSet (though we don't currently support this in the module used above).

At this point it would be possible to use AWS CLI to SSH into the server:

```bash
aws ec2-instance-connect ssh --instance-id i-XXX --profile ssh --os-user myuser
```

But we can also use the AWS CLI to open a tunnel to the instance, and use the SSH command seamlessly. Add the following ProxyCommand to your `~/.ssh/config`, either against a specific host or use a separate Match directive to share the command across multiple instances:

```ssh
# Direct route over IPv6
Host sandbox
    Hostname sandbox.myorg.com

# EIC tunnel for IPv4 fallback
Host sandboxtunnel
    Hostname i-XXX

Match host="i-*"
    ProxyCommand aws ec2-instance-connect open-tunnel --instance-id %h --profile ssh
```

And there you have it! A fully IPv6-enabled VPC and EC2 instance, with a completely free and seamless fallback for IPv4-only clients. Now we need to actually remove the IPv4 addresses.

There are a few different approaches depending on how the address was assigned in the first place, but I have IPs auto assigned via the subnet, so let's remove that:

```diff
 resource "aws_subnet" "public" {
   vpc_id                          = aws_vpc.default.id
-  map_public_ip_on_launch         = true
   assign_ipv6_address_on_creation = true
   ipv6_cidr_block                 = cidrsubnet(aws_vpc.default.ipv6_cidr_block, 8, 0)
   cidr_block                      = cidrsubnet(aws_vpc.default.cidr_block, 4, 0)
 }
```

Because this isn't an Elastic IP I can't simply dissociate the IP address, so to avoid destroying the instance again I need to do something similar to earlier where I attached the IPv6 address, following [CyclingDave's Stack Overflow answer][6]. Assign a new network interface and Elastic IP:

```terraform
resource "aws_network_interface" "temp" {
  subnet_id = aws_subnet.public.id

  attachment {
    instance     = aws_instance.sandbox.id
    device_index = 1
  }
}

resource "aws_eip" "temp" {
  instance = aws_instance.sandbox.id
  domain   = "vpc"
}
```

Now, in the AWS Console,

[1]: https://aws.amazon.com/blogs/aws/new-aws-public-ipv4-address-charge-public-ip-insights/
[2]: https://mattias.holmlund.se/2017/09/setting-up-ipv6-on-aws-with-terraform/
[3]: https://colinbarker.me.uk/blog/2023-03-04-enabling-ipv6-on-aws-using-terraform-ec2-part-2/
[4]: https://aws.amazon.com/blogs/compute/secure-connectivity-from-public-to-private-introducing-ec2-instance-connect-endpoint-june-13-2023/
[5]: https://github.com/answerdigital/terraform-modules/tree/main/modules/aws/sso_account_assignment
[6]: https://stackoverflow.com/a/54153371/283078
