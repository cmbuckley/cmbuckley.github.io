require 'rspec'
require 'net/http'
require 'safe_yaml'
require 'uri'

pages = Dir.glob('_site/**/*.html')
config = SafeYAML.load_file('_config.yml')

pages.each do |page|
  describe page do
    page_content = File.read(page)

    unless page_content.include?("<title>Redirecting")
        it 'should have valid meta description' do
          patterns = {
            "description"         => /<meta content="(.+)" name="description">/,
            "og:description"      => /<meta content="(.+)" property="og:description">/,
            "twitter:description" => /<meta content="(.+)" name="twitter:description">/
          }

          patterns.each do |type, pattern|
            page_content.scan(pattern).each do |description|
              expect(description[0].length).to be_between(10, 120)
            end.empty? and raise "could not find #{type}"
          end
        end

        it 'should have valid title' do
          page_content.scan(/<title>(.+)<\/title>/).each do |title|
            expect(title[0].length).to be_between(10, 70)
            expect(title[0]).to match(/(.+ • )?Chris Buckley/)
          end.empty? and raise "could not find page title"

          page_content.scan(/<meta content="(.+)" property="og:title">/).each do |title|
            expect(title[0].length).to be <= 70
          end.empty? and raise "could not find og:title"

          page_content.scan(/<meta content="(.+)" name="twitter:title">/).each do |title|
            expect(title[0].length).to be <= 70
          end.empty? and raise "could not find twitter:title"
        end

        it 'should have a valid canonical URL' do
          urls = []

          page_content.scan(/<meta content="(.+)" property="og:url">/).each do |url|
            urls.push(url[0])
          end.empty? and raise "could not find og:url"

          page_content.scan(/<meta content="(.+)" name="twitter:url">/).each do |url|
            urls.push(url[0])
          end.empty? and raise "could not find twitter:url"

          page_content.scan(/<link rel="canonical" href="(.+)">/).each do |url|
            urls.push(url[0])
          end.empty? and raise "could not find canonical url"

          urls.uniq.each do |url|
            url =~ /\A#{URI::regexp(['https'])}\z/ or raise "canonical URL is not https"
          end
        end

        it 'should have a valid image' do
          urls = []
          patterns = {
            "og:image"      => /<meta content="(.+)" property="og:image">/,
            "twitter:image" => /<meta content="(.+)" name="twitter:image:src">/
          }

          patterns.each do |type, pattern|
            page_content.scan(pattern).each do |url|
              urls.push(url[0])
            end.empty? and raise "could not find #{type}"
          end

          urls.uniq.each do |url|
            url =~ /\A#{URI::regexp(['https'])}\z/ or raise "image URL is not https"
          end

          page_content.scan(/<meta content="(.+)" property="og:image:alt">/).each do |alt|
          end.empty? and raise "could not find og:image:alt"
        end

        it 'should have a valid image alt' do
          patterns = {
            "og:image:alt"      => /<meta content="(.+)" property="og:image:alt">/,
            "twitter:image:alt" => /<meta content="(.+)" name="twitter:image:alt">/
          }

          patterns.each do |type, pattern|
            page_content.scan(pattern).each do |alt|
              expect(alt[0].length).to be_between(10, 125), alt[0]
            end.empty? and raise "could not find #{type}"
          end
        end
      end
  end
end
