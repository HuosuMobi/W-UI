/*!
 * WUI's Gruntfile
 */

/* jshint node: true */
module.exports = function(grunt) {
	'use strict';

	// Force use of Unix newlines
	grunt.util.linefeed = '\n';

	RegExp.quote = function(string) {
		return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
	};

	var generateNamespace = require('./grunt/WUI-namespace-generator.js');
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Metadata.
		meta: {
			libPath: 'lib/',
			distPath: 'dist/',
			jsPath: 'js/',
			sassPath: 'sass/',
			examplesPath: 'examples/hello-WUI/'
		},

		banner: '/*!\n' +
			' * =====================================================\n' +
			' * WUI v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
			' * =====================================================\n' +
			' */\n',

		clean: {
			all: ['<%= meta.distPath %>'],
			sourceMap: ['<%= meta.distPath %>css/*.map']
		},

		concat: {
			WUI: {
				options: {
					banner: '<%= banner %>'
				},
				src: [
					'js/WUI.js',
					'js/WUI.detect.js',
					'js/WUI.detect.5+.js',
					'js/WUI.event.js',
					'js/WUI.target.js',
					'js/WUI.fixed.js',
					'js/WUI.fixed.bind.js',
					'js/WUI.fixed.classlist.js',
					'js/WUI.fixed.animation.js',
					'js/WUI.fixed.fastclick.js',
					'js/WUI.fixed.keyboard.js',
					'js/WUI.namespace.js',
					'js/WUI.gestures.js',
					'js/WUI.gestures.flick.js',
					'js/WUI.gestures.swipe.js',
					'js/WUI.gestures.drag.js',
					'js/WUI.gestures.tap.js',
					'js/WUI.gestures.longtap.js',
					'js/WUI.gestures.hold.js',
					'js/WUI.gestures.pinch.js',
					'js/WUI.init.js',
					'js/WUI.init.5+.js',
					'js/WUI.back.js',
					'js/WUI.back.5+.js',
					'js/WUI.init.pullrefresh.js',
					'js/WUI.ajax.js',
					'js/WUI.ajax.5+.js',
					'js/WUI.layout.js',
					'js/WUI.animation.js',
					'js/WUI.class.js',
					'js/WUI.pullRefresh.js',
					'js/WUI.class.scroll.js',
					'js/WUI.class.scroll.pullrefresh.js',
					'js/WUI.class.scroll.slider.js',
					'js/pullrefresh.5+.js',
					'js/WUI.offcanvas.js',
					'js/actions.js',
					'js/modals.js',
					'js/popovers.js',
					'js/segmented-controllers.js',
					'js/switches.js',
					'js/tableviews.js',
					'js/WUI.dialog.alert.js',
					'js/WUI.dialog.confirm.js',
					'js/WUI.dialog.prompt.js',
					'js/WUI.dialog.toast.js',
					'js/WUI.popup.js',
					'js/input.plugin.js',
					'js/WUI.number.js'

				],
				dest: '<%= meta.distPath %>js/<%= pkg.name %>.js',
			}
		},

		sass: {
			options: {
				banner: '<%= banner %>',
				style: 'expanded',
				unixNewlines: true
			},
			dist: {
				files: {
					'<%= meta.distPath %>css/<%= pkg.name %>.css': 'sass/WUI.scss',
				}
			}
		},

		csscomb: {
			options: {
				config: 'sass/.csscomb.json'
			},
			dist: {
				files: {
					'<%= meta.distPath %>/css/<%= pkg.name %>.css': '<%= meta.distPath %>/css/<%= pkg.name %>.css'
				}
			},
		},

		copy: {
			fonts: {
				expand: true,
				src: 'fonts/WUI*.ttf',
				dest: '<%= meta.distPath %>/'
			},
			examples: {
				expand: true,
				cwd: '<%= meta.distPath %>',
				src: ['**/WUI*'],
				dest: '<%= meta.examplesPath %>'
			}
		},

		cssmin: {
			options: {
				banner: '', // set to empty; see bellow
				keepSpecialComments: '*', // set to '*' because we already add the banner in sass
				sourceMap: false
			},
			WUI: {
				src: '<%= meta.distPath %>css/<%= pkg.name %>.css',
				dest: '<%= meta.distPath %>css/<%= pkg.name %>.min.css'
			}
		},

		uglify: {
			options: {
				banner: '<%= banner %>',
				compress: {},
				mangle: true,
				preserveComments: false
			},
			WUI: {
				src: '<%= concat.WUI.dest %>',
				dest: '<%= meta.distPath %>js/<%= pkg.name %>.min.js'
			}
		},

		watch: {
			options: {
				dateFormat: function(time) {
					grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
					grunt.log.writeln('Waiting for more changes...');
				},
				livereload: true
			},
			scripts: {
				files: [
					'<%= meta.sassPath %>/**/*.scss',
					'<%= meta.jsPath %>/**/*.js',
				],
				tasks: 'dist'
			}
		},

		jshint: {
			options: {
				jshintrc: 'js/.jshintrc'
			},
			grunt: {
				src: ['Gruntfile.js', 'grunt/*.js']
			},
			src: {
				src: 'js/*.js'
			}
		},

		jscs: {
			options: {
				config: 'js/.jscsrc'
			},
			grunt: {
				src: '<%= jshint.grunt.src %>'
			},
			src: {
				src: '<%= jshint.src.src %>'
			},
			docs: {
				src: '<%= jshint.docs.src %>'
			}
		},

		csslint: {
			options: {
				csslintrc: 'sass/.csslintrc'
			},
			src: [
				'<%= meta.distPath %>/css/<%= pkg.name %>.css',
			]
		},
		sed: {
			versionNumber: {
				pattern: (function() {
					var old = grunt.option('oldver');
					return old ? RegExp.quote(old) : old;
				})(),
				replacement: grunt.option('newver'),
				recursive: true
			}
		}
	});
	// Load the plugins
	require('load-grunt-tasks')(grunt, {
		scope: 'devDependencies'
	});
	require('time-grunt')(grunt);
	// Default task(s).
	grunt.registerTask('cleanAll', ['clean']);
	grunt.registerTask('dist-css', ['sass', 'csscomb', 'cssmin', 'clean:sourceMap']);
	grunt.registerTask('dist-js', ['concat', 'build-namespace', 'uglify']);
	grunt.registerTask('dist', ['clean:all', 'dist-css', 'dist-js', 'copy']);
	grunt.registerTask('build', ['dist']);
	grunt.registerTask('default', ['dist']);


	grunt.registerTask('build-namespace', generateNamespace);

	grunt.registerTask('server', ['dist','watch']);



	// Version numbering task.
	// grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
	// This can be overzealous, so its changes should always be manually reviewed!
	grunt.registerTask('change-version-number', 'sed');

	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
};