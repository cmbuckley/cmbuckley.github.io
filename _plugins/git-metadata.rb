module Jekyll
  class GitMetadataGenerator < Generator
    def generate(site)
	  raise "Git is not installed" unless git_installed?

      Dir.chdir(site.source) do
        site.config['git'] ||= {}
        site.config['git']['branch'] =  %x{ git rev-parse --abbrev-ref HEAD }.strip
      end
    end

    def git_installed?
      system "git --version > /dev/null 2>&1"
    end
  end
end
