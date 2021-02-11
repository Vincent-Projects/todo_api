module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        apidoc: {
            myapp: {
                src: "src/",
                dest: "docs/src"
            }
        }
    });

    grunt.loadNpmTasks('grunt-apidoc');
    grunt.registerTask('default', ['apidoc']);
};
