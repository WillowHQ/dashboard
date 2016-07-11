// Fix browserSync
// Fix Watch / Restart

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
//var gulpNgConfig = require('gulp-ng-config');
var sass = require('gulp-sass');
    browserSync = require('browser-sync');
    reload = browserSync.reload;
var mongoose = require('mongoose');
var db = require('./server/config/env/development.js').db;
var User = require('./server/models/user.js');
var Pandorabot = require('pb-node');
var _ = require('underscore');
var SurveyTemplate = require('./server/models/surveyTemplate.js');
var Message = require('./server/models/message.js');
var Reminder = require('./server/models/reminder.js');
var portfinder = require('portfinder');

var botOptions = {
  url: 'https://aiaas.pandorabots.com',
  app_id: '1409612709792',
  user_key: '83a7e3b5fa60385bd676a05cb4951e98',
  botname: 'willow'
};

var bot = new Pandorabot(botOptions);
//adding comment to trigger update 
var paths = {
  angular: ['app/dist/**/*.js'],
  css: ['app/assets/styles/css/**/*.css'],
  sass: ['app/**/*.scss'],
  views: ['app/dist/views/*.html'],
  server: ['server/**/*.js']
}


// gulp.task('config', function(){
//   return gulp.src('configFile.json')
//         .pipe(gulpNgConfig('dashboard.config', {wrap:true}))
//         .pipe(gulp.dest('.'))
// });



gulp.task('sass', function () {
  return gulp.src('app/dist/triangular/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/dist/triangular/assets/css'));
});

gulp.task('nodemon' ,['sass'], function (cb) {
	var started = false;
	return nodemon({
		script: 'app.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});
});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
    injectChanges: true,
		proxy: "http://localhost:12557",
        files: ["app/**/*.*"],
        browser: 'google chrome',
        port: 7000,
	});
});

gulp.task('watch', function() {
  gulp.watch(paths.angular, reload);
  gulp.watch(paths.server, reload);
  //gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.css, reload);
});

//TODO: allow cleaning any model
gulp.task('clean', function() {
  mongoose.connect(db);
  bot.get(function (err, res) {
    if (!err) {
      console.log(res);
      _.each(res.files, function (file) {
        if (file.name != 'helloworld.aiml' && file.name != 'personality.aiml') {
          bot.remove(file.name, function (err, res) {
            if (!err) {
              console.log(res);
              bot.compile(function (err, res) {
                if (!err) {
                  console.log('Success');
                  console.log(res);
                }
              });
            }
          });
        }
      });
    }
  });
  SurveyTemplate.find({}, function (err, surveys) {
    _.each(surveys, function (survey) {
      User.find({}, function (err, users) {
        _.each(users, function (user) {
          bot.remove('botfiles/' + survey._id + user._id + '.aiml', function (err, res) {
            if (!err) {
              console.log(res);
              bot.compile(function (err, res) {
                if (!err) {
                  console.log('Bot file removed');
                  console.log(res);
                } else {
                  console.log('Error compiling bot');
                  console.log(err);
                }
              });
            } else {
              console.log('Error removing file');
              console.log(err);
            }
          });
        });
      });
    })
  })
  var conn = mongoose.connection;
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function() {
    conn.collection('reminders').drop(function (err) {
      User.find({}, function (err, users) {
        if (!err) {
          users.forEach(function (_user, index) {
            var user = _user.toObject();
            user.reminders = [];
            _user.set(user);
            _user.save(function (err, user) {
              if (!err) {
                console.log(user);
              }
            });
          });
        }
      });
      console.log('Reminders dropped.');
    });
    conn.collection('users').drop(function(err) {
      console.log('Users dropped');
      var colin = new User({
        firstName: 'Colin',
        lastName: 'Hryniowski',
        bio: 'I\'m a Coach',
        username: 'colinhryniowski@gmail.com',
        password: 'letmein',
        slack_id: 'colin',
        slack: {
          email: 'colinhryniowski@gmail.com',
          id: 'colin',
          img: 'ashley.png',
          name: 'Colin Hryniowski',
          real_name: 'Colin Hryniowski'
        },
        imageUrl: 'ashley.png',
        role: 'coach',
        provider: 'local',
        phoneNumber: '+12898062194'
      });
      colin.save(function (err) {
        if (err) {
          console.log('DB is now broken, good luck.');
        }
      });
      conn.collection('surveytemplates').drop(function (err) {
        if (!err) {
          conn.collection('messages').drop(function (err) {
            if (!err) {
              console.log('DB successfully wiped:');
              User.find({}, function (err, user) {
                console.log(user);
              });
              Reminder.find({}, function (err, reminder) {
                console.log(reminder);
              });
              SurveyTemplate.find({}, function (err, survey) {
                console.log(survey);
              });
              Message.find({}, function (err, message) {
                console.log(message);
              });
            }
          })
        }
      })
    });
  });
});

gulp.task("heroku:production", function(){
    console.log('hello'); // the task does not need to do anything.
});

gulp.task('default', ['browser-sync']);
