# Rquire jekyll to compile the site.
require "jekyll"
require "fileutils"
require "rmagick"


#--------------------------------------------------------
# Settings
#
IMAGE_DIR = "images"
GALLERY_DIR = "#{IMAGE_DIR}/gallery"

THUMB_WIDTH = 128
THUMB_HEIGHT = 96

IMAGE_MAX_WIDTH = 800

TOOL_EDITOR = "vim"
TOOL_GIT = "git"

TOOL_OPTIM_JPEG = "jpegoptim -m85 --strip-all --threshold=1% <FILENAME>"
TOOL_OPTIM_PNG = "optipng -o4 <FILENAME>"

#--------------------------------------------------------



#########################################################
#
# build incrementally
#
#########################################################
desc "Build incrementally"
task :build => [:update_lastmod] do
    puts "## Build site (incremental).."
    puts ""

    system "bundle exec jekyll build --safe --incremental"
end



#########################################################
#
# rebuild entire site
#
#########################################################
desc "Rebuild entire site"
task :rebuild => [:update_lastmod] do
    puts "## Re-build site.."
    puts ""

    system "bundle exec jekyll build --safe"
end



#########################################################
#
# preview
#
#########################################################
desc "Serve site locally"
task :preview => [:update_lastmod] do
    puts "## Preview site"
    puts ""

    system "bundle exec jekyll serve"
end



#########################################################
#
# optimize images
#
#########################################################
desc "Optimize images"
task :optimize do
    puts "## Optimizing jpeg files"
    puts "------------------------------------"

    Dir.glob("./#{IMAGE_DIR}/**/*.{jpg,jpeg}").each do |filename|

        command = "#{TOOL_OPTIM_JPEG}".gsub(/<FILENAME>/, filename)
        system(command)
    end

    puts "-------------------------------------"
    puts ""

    puts "## Optimizing png files"
    puts "------------------------------------"

    Dir.glob("./#{IMAGE_DIR}/**/*.{png}").each do |filename|

        command = "#{TOOL_OPTIM_PNG}".gsub(/<FILENAME>/, filename)
        system(command)
    end

    puts "-------------------------------------"
    puts ""

end



#########################################################
#
# Publish
#
#########################################################
desc "Publish"
task :publish do
    system "#{TOOL_GIT} add ."
    system "#{TOOL_GIT} commit"
    system "#{TOOL_GIT} push"
end



#########################################################
#
# Edit post
#
#########################################################
desc "Edit post"
task :edit, [:category, :name] do |t, args|

    category = (args.category ? args.category : "")
    name = (args.name ? args.name : "")

    most_recent = nil
    most_recent_filename = ""
    Dir.glob("./_posts/*#{category}*/*#{name}*.md").each do |filename|

        matches = filename.scan(/\/(\d{4})-(\d{2})-(\d{2})-/)

        if matches[0].nil?
            next
        end

        year = matches[0][0].to_i
        month = matches[0][1].to_i
        day = matches[0][2].to_i

        post_date = Date.new(year, month, day)

        if most_recent.nil? or post_date > most_recent
            most_recent = post_date
            most_recent_filename = filename
        end
    end

    if not most_recent_filename.empty?
        system "#{TOOL_EDITOR} #{most_recent_filename}"
    else
        puts "No post found with those criteria"
        puts ""
    end
end



#########################################################
#
# Create post
#
#########################################################
desc "Create post"
task :create, [:category, :name] do |t, args|


    if args.category.nil? or args.category.empty?
        puts "** Missing category parameter!"
        puts "    Usage : rake create[category, name]"
        puts ""
        break
    end

    if args.name.nil? or args.name.empty?
        puts "** Missing name parameter!"
        puts "    Usage : rake create[category, name]"
        puts ""
        break
    end

    post_date = Time.now.strftime("%Y-%m-%d %H:%M:%S %Z")
    permalink = "/posts/#{args.category}/#{args.name}"
    filename = sprintf("_posts/%s/%s-%s.md", args.category, Time.now.strftime("%Y-%m-%d"), args.name)


    if not File.file?(filename)

        File.open(filename, "w") do |file|

            file.puts "---"
            file.puts "type:        article"
            file.puts "layout:      post"
            file.puts "title:       "
            file.puts "description: "
            file.puts "author:      Benoit Frigon"
            file.puts "author-link: https://plus.google.com/u/0/100667493604379348233"
            file.puts "date:        #{post_date}"
            file.puts "lastmod:     #{post_date}"
            file.puts "permalink:   #{permalink}"
            file.puts "thumbnail:   "
            file.puts ""
            file.puts "categories:  []"
            file.puts "tags:        []"
            file.puts ""
            file.puts "sitemap-priority: 0.9"
            file.puts ""
            file.puts "---"
            file.puts ""
            file.puts ""
        end
    end

    system "#{TOOL_EDITOR} #{filename}"
end



#########################################################
#
# Update lastmod variable in each posts if the source
# file last modification time has changed.
#
#########################################################
desc "Update lastmod variable in each posts"
task :update_lastmod do

    puts "## Update lastmod variable in each posts"

    Dir.glob("./_posts/**/*.md").each do |filename|
        # Get the actual file last modification #
        source_mtime = File.mtime(filename).to_time

        content = File.read(filename)

        # Find the current lastmod value in file
        match = content.scan(/^(lastmod)\s*:(.*)$/i)

        new_lastmod = Time.now.strftime("%Y-%m-%d %H:%M:%S %Z")

        if match[0].nil?

            puts "    no lastmod variable in #{filename}"
            puts ""

            # Insert a lastmod value to the file
            File.open(filename, "w") do |file|
                file.puts content.gsub(/\A---/, "---\nlastmod:     #{new_lastmod}")
            end

        else
            if not match[0][1].empty?
                lastmod = Time.parse(match[0][1])

                # Skip if the difference is less than 1 minute
                diff = (source_mtime - lastmod) / 60
                next if diff < 1

                puts "   lastmod changed for #{filename} :"
                puts "    -(From #{lastmod} to #{source_mtime}"
                puts ""
            else
                puts "    no lastmod variable in #{filename}"
                puts ""
            end

            # Update the new lastmod value in the file
            File.open(filename, "w") do |file|
                file.puts content.gsub(/^lastmod\s*:.*$/i, "lastmod:     #{new_lastmod}")
            end
        end
    end
end


#########################################################
#
# Resize images
#
#########################################################
desc "Resize images"
task :resize_images do

    img_count = 0
    gallery_dir = File.expand_path(IMAGE_DIR)

    Dir.glob(File.join(gallery_dir, "**", "*.{png,jpg,jpeg}")).each do |file|
        if !File.dirname(file).include? "thumbs"

            img = Magick::Image.read(file).first
            width = img.columns + 0.0
            height = img.rows + 0.0
            new_width = 0
            new_height = 0


            if width >= height and width > IMAGE_MAX_WIDTH

                # For horizontal pictures
                new_width = IMAGE_MAX_WIDTH
                new_height = IMAGE_MAX_WIDTH * ( height / width )

            elsif height > width and height > IMAGE_MAX_WIDTH

                # For vertical pictures
                new_height = IMAGE_MAX_WIDTH
                new_width = IMAGE_MAX_WIDTH * ( width / height )

            end

            if new_width > 0
                printf("%s : resize %dx%d => %dx%d\n", file, width, height, new_width, new_height);

                new_img = img.resize(new_width, new_height);
                new_img.write(file)
                new_img.destroy!

                img_count += 1
            end

            img.destroy!
        end
    end

    printf("%d image(s) resized\n\n", img_count)
end

#########################################################
#
# Generate thumbnails
#
#########################################################
desc "Generate thumbnails"
task :thumbnails do

    img_count = 0
    gallery_dir = File.expand_path(GALLERY_DIR)

    print "\n-------------------------------------------------------------\n"
    print "Generating thumbnails...\n\n"

    Dir.glob(File.join(gallery_dir, "**", "*.{png,jpg,jpeg,gif}")).each do |file|
        if !File.dirname(file).include? "thumbs"


            rel_path = File.dirname(file.sub(gallery_dir + "/", ""))
            thumb_name = File.join(gallery_dir, rel_path, "thumbs", File.basename(file))

            if !File.exists?(thumb_name)

                FileUtils.mkdir_p(File.dirname(thumb_name))

                print ".. " + File.join(rel_path, File.basename(file)) + "\n"

                img = Magick::Image.read(file).first
                thumb = img.resize_to_fill!(THUMB_WIDTH, THUMB_HEIGHT)
                thumb.write(thumb_name)

                thumb.destroy!
                img.destroy!

                img_count += 1
            end
        end
    end

    printf("%d thumbnail(s) generated\n\n", img_count)
end


task :default do
    Rake::Task["build"].execute
end
