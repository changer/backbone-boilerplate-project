# Boilerplate for Backbone + LayoutManager and common libraries

### Getting started

Clone a copy of our empty project setup:

```
git clone git@github.com:changer/backbone-boilerplate-project.git my-app
cd my-app
rm -rf .git
echo '# My new project' > README.md
git init
git commit -m "My commit to my-app"
git submodule update --init --recursive
```

This will take a while as all libraries will be cloned from Github.

Now you can start building your app!

### Debug/Release

This boilerplate includes a Grunt-setup for building releases. It also supports sprite-generation.

# Install grunt on your machine:
```
npm install -g grunt
```

# Install required packages for boilerplate grunt setup:
```
npm install
```

# Generate sprite.png and sprite.less from all images inside /assets/img/sprite:
```
grunt spritesheet
```

# Generate debug / release build
```
grunt debug or grunt release
```

# Happy coding
