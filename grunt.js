// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-targethtml');
  grunt.loadNpmTasks('node-spritesheet');
  grunt.loadNpmTasks('grunt-closure-compiler');
  grunt.loadNpmTasks('grunt-smushit');
  grunt.loadNpmTasks('grunt-rev-package');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-bump');

  grunt.initConfig({

    pkg: '<json:package.json>',

    clean: {
      temp: ['dist/temp', 'dist/debug/app.js.report.txt', 'dist/release/app.js.report.txt'],
      debug: 'dist/debug',
      release: 'dist/release'
    },

    lint: {
      files: ['app/config.js', 'app/*.js', 'app/modules/*.js', 'app/helpers/*.js']
    },

    requirejs: {
      compile: {
        options: {
          mainConfigFile: 'app/boilerplate/config.js',
          baseUrl: 'app',
          optimize: 'none',
          insertRequire: ['boot'],
          out: 'dist/temp/app.js',
          name: 'config'
        }
      }
    },

    jst: {
      compile: {
        options: {
          templateSettings: {
            variable: 'context'
          }
        },
        files: {
          'dist/temp/templates.js': [
            'app/templates/**/*.html'
          ]
        }
      }
    },

    finishjst: {
      temp: {
        input: 'dist/temp/templates.js'
      }
    },

    concat: {
      debug: {
        src: [
          'app/boilerplate/libs/almond.js',
          'dist/temp/templates.js',
          'dist/temp/app.js'
        ],
        dest: 'dist/debug/app.js',
        separator: ';'
      },
      release: {
        src: [
          'app/boilerplate/libs/almond.js',
          'dist/temp/templates.js',
          'dist/temp/app.js'
        ],
        dest: 'dist/temp/app.js',
        separator: ';'
      }
    },

    spritesheet: {
      compile: {
        options: {
          outputCss: 'assets/css/sprite.less',
          selector: '.sprite',
          output: {
            legacy: {
              pixelRatio: 1,
              outputImage: '/assets/img/sprite.png'
            },
            retina: {
              pixelRatio: 2,
              outputImage: '/assets/img/sprite2x.png'
            }
          }
        },
        files: {
          '': 'assets/img/sprite/*'
        }
      }
    },

    spritesheetless: {
      compile: {
        input: 'assets/css/sprite.less'
      }
    },

    less: {
      debug: {
        src: 'assets/css/app.less',
        dest: 'dist/debug/app.css'
      },
      release: {
        src: 'assets/css/app.less',
        dest: 'dist/temp/app.css'
      }
    },

    finishless: {
      debug: {
        input: 'dist/debug/app.css'
      },
      release: {
        input: 'dist/temp/app.css'
      }
    },

    mincss: {
      'dist/release/app.css': [
        'dist/temp/app.css'
      ]
    },

    'closure-compiler': {
      release: {
        js: 'dist/temp/app.js',
        jsOutputFile: 'dist/release/app.js',
        maxBuffer: 10000,
        options: {
          compilation_level: 'SIMPLE_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5'
        }
      }
    },

    targethtml: {
      debug: {
        src: 'index.html',
        dest: 'dist/debug/index.html'
      },
      release: {
        src: 'index.html',
        dest: 'dist/release/index.html'
      }
    },

    copy: {
      debug: {
        files: {
          'dist/debug/assets/img/': 'assets/img/*.png',
          'dist/debug/assets/fonts/': 'assets/fonts/*',
          'dist/debug/assets/fonts/font-awesome/': 'app/boilerplate/assets/font-awesome/*',
          'dist/debug/app/templates/': 'app/templates/**',
          'dist/debug/': ['*.txt', '*.ico']
        }
      },
      release: {
        files: {
          'dist/release/assets/img/': 'assets/img/*.png',
          'dist/release/assets/fonts/': 'assets/fonts/*',
          'dist/release/assets/fonts/font-awesome/': 'app/boilerplate/assets/font-awesome/*',
          'dist/release/app/templates/': 'app/templates/**',
          'dist/release/': ['*.txt', '*.ico']
        }
      }
    },

    smushit: {
      specific: {
        src: 'dist/release/assets/img/*.png'
      }
    },

    revPackage: {
      release: ['dist/release/app.js', 'dist/release/app.css', 'dist/release/assets/img/sprite*']
    },

    replace: {
      release: {
        options: {
          variables: {
            version: '<%= pkg.version %>',
            timestamp: '<%= grunt.template.today() %>'
          }
        },
        files: {
          'dist/release/': ['dist/release/*.html', 'dist/release/*.css', 'dist/release/*.js']
        }
      }
    }

  });

  grunt.registerMultiTask('finishjst', 'jst output contains wrong paths', function() {
    if (!this.data) { return false; }

    var file = grunt.file,
        data = this.data,
        target = this.target,
        contents = file.read(data.input);

    if(contents) {
      contents = contents.replace(/public\//g, '');
      contents = contents.replace(/this\["JST"\]/g, 'window.JST');
      file.write(data.input, contents);
      console.log('Finished ' + data.input, target);
    }
  });

  grunt.registerMultiTask('spritesheetless', 'spritesheet output contains needs less comp', function() {
    if (!this.data) { return false; }
    var file = grunt.file,
        data = this.data,
        target = this.target,
        contents = file.read(data.input),
        im = require('./node_modules/node-spritesheet/lib/imagemagick'),
        done = this.async();

    if(contents && /^([\s\S]*?)\@media[\s\S]*?\{([\s\S]*?)\}[\r\n]*$/.test(contents)) {
      var input = RegExp.$1;
      im.identify('assets/img/sprite.png', function(image) {
        input = input +
            '.sprite {\n' +
            '  @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-resolution: \'192dpi\') {\n' +
            '    background-image: url(\'../img/sprite2x.png\');\n' +
            '    background-size: ' + image.width + 'px ' + image.height + 'px;\n' +
            '  }\n' +
            '}';

        file.write(data.input, input);
        console.log('Finished ' + data.input, target);
        done();
      });
    }
  });

  grunt.registerMultiTask('finishless', 'spritesheet output contains wrong paths', function() {
    if (!this.data) { return false; }

    var file = grunt.file,
        data = this.data,
        target = this.target,
        contents = file.read(data.input);

    if(contents) {
      contents = contents.replace(/\.\.\/img/g, 'assets/img');
      contents = contents.replace(/\.\.\/fonts/g, 'assets/fonts');
      contents = contents.replace(/\.\/fontawesome-webfont/g, 'assets/fonts/font-awesome/fontawesome-webfont');
      contents = contents.replace(/sprite\.png/g, 'sprite.@@version.png');
      contents = contents.replace(/sprite2x\.png/g, 'sprite2x.@@version.png');
      file.write(data.input, contents);
      console.log('Finished ' + data.input, target);
    }
  });

  grunt.registerTask('default', 'release');
  grunt.registerTask('debug', 'clean:debug lint jst finishjst requirejs concat:debug less:debug finishless:debug targethtml:debug copy:debug clean:temp');
  grunt.registerTask('release', 'clean:release lint jst finishjst requirejs concat:release less:release finishless:release copy:release closure-compiler mincss targethtml:release revPackage replace:release clean:temp');
  grunt.registerTask('all', 'debug release');
  grunt.registerTask('full', 'spritesheet spritesheetless debug release smushit');

};
