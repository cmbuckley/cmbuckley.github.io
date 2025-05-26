require 'rspec'
require 'date'
require 'net/http'
require 'safe_yaml'
require 'uri'

posts = Dir.glob('_posts/*.md')
category_files = Dir.glob('_blog_categories/*.md');
valid_categories = category_files.map { |category| SafeYAML.load_file(category)['name'] }

posts.each do |post|
  describe post do
    it 'should have a valid frontmatter' do
      expect { SafeYAML.load_file post }.not_to raise_error
    end

    it 'should have valid dates' do
      file_date = File.basename(post)[0..9]
      expect { Date.parse(file_date) }.not_to raise_error
      expect(Date.parse(file_date)).to be_instance_of(Date)
    end

    it 'should have valid categories' do
      post_categories = SafeYAML.load_file(post)['categories']

      expect(post_categories).not_to be_empty
      expect(valid_categories).to include(*post_categories)
    end

    it 'should have valid links' do
        post_content = File.read(post)
        post_content.scan(/^!?\[(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+(?:"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/).each do |link|
            unless link[0].chars.first == '/'
                uri = URI.parse(URI.escape(link[0]))
                skip 'pictures links not tested yet' if uri.host == 'pictures.scholesmafia.co.uk'

                begin
                    response = Net::HTTP.get_response(uri)
                rescue OpenSSL::SSL::SSLError
                    skip "got SSL error for #{link[0]}, hopefully temporary"
                end

                begin
                    expect(['200', '301', '302', '303', '307']).to include(response.code), "got #{response.code} for #{link[0]}"
                rescue
                    print response.body
                    fail
                end
            end
        end
    end
  end
end
