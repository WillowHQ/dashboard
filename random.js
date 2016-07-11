var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

var options = {
    url: 'https://slack.com/api/users.list',
    method: 'GET',
    headers: headers,
    qs:	{
      'token': 'xoxp-21143396339-21148553634-24144454581-f6d7e3347d',
    }
}

request(options, function (error, response, body) {
    console.log('request is here');
    if (!error && response.statusCode == 200) {
          var members = JSON.parse(body).members;
        _.forEach(members, function(member) {
          if(!member.is_bot && !member.deleted){
            slack.push({
              team: member.team_id,
              id: member.id,
              name: member.name,
              real_name: member.real_name,
              email: member.profile.email,
              img: member.profile.image_72,
              timezone: member.tz
            });
          }
        });

        _.forEach(slack, function(member) {
          console.log('hello');
          request.post('http://localhost:8081/generate',{
            form: {
                coach: req.user.id,
                username: member.email,
                slack: member
              }
          }, function(err,httpResponse,body){
            if(err) {
              //console.log(err);
            }
            else {
              console.log(body);
            }
          })
        })

    }
});


db.users.update(
  {username:'colinhryniowski@gmail.com'},
  {$set: {role: 'coach'}}
);


// Colors
var gradient = {
  '1':'#F44336',
  '2':'#F77B37',
  '3':'#FBB139',
  '4':'#FFEB3B',
  '5':'#C3D742',
  '6':'#87C349',
  '7':'#4CAF50'
}
