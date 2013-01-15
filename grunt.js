// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-less');
  grunt.loadNpmTasks('grunt-targethtml');
  grunt.loadNpmTasks('node-spritesheet');

  grunt.initConfig({

    clean: ['dist/'],

    lint: {
      files: [
        'app/config.js', ['app/*.js', 'app/*/*.js']
      ]
    },

    requirejs: {
      compile: {
        options: {
          mainConfigFile: 'app/boilerplate/config.js',
          baseUrl: 'app/',
          optimize: 'none',
          insertRequire: ['boot'],
          out: 'dist/debug/app.js',
          name: 'config'
        }
      }
    },

    jst: {
      compile: {
        files: {
          'dist/debug/templates.js': [
            'app/templates/**/*.html'
          ]
        }
      }
    },

    concat: {
      dist: {
        src: [
          'app/boilerplate/libs/almond.js',
          'dist/debug/templates.js',
          'dist/debug/app.js'
        ],
        dest: 'dist/debug/app.js',
        separator: ';'
      }
    },

    spritesheet: {
      compile: {
        options: {
          outputImage: 'img/sprite.png',
          outputCss: 'css/sprite.less',
          selector: '.sprite'
        },
        files: {
          'assets': 'assets/img/sprite/**/*'
        }
      }
    },

    less: {
      application: {
        src: 'assets/css/app.less',
        dest: 'dist/debug/assets/css/app.css'
      }
    },

    mincss: {
      'dist/release/assets/css/app.css': [
        'dist/debug/assets/css/app.css'
      ]
    },

    min: {
      'dist/release/app.js': [
        'dist/debug/app.js'
      ]
    },

    targethtml: {
      debug: {
        input: 'index.html',
        output: 'dist/debug/index.html'
      },
      release: {
        input: 'index.html',
        output: 'dist/release/index.html'
      }
    },

    copy: {
      dist: {
        files: {
          'dist/debug/assets/img/': 'assets/img/*',
          'dist/release/assets/img/': 'assets/img/*'
        }
      }
    }

  });

  grunt.registerTask('debug', 'clean lint jst requirejs concat spritesheet less targethtml copy');
  grunt.registerTask('release', 'debug min mincss targethtml copy');

};
