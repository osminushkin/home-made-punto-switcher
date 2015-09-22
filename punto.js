/**
 * sudo apt-get install xclip
 * sudo apt-get install xdotool
 *
 * Settings -> Keyboard -> Shortcuts -> Custom shortcuts ->
 *   New (command: node {path}/punto)
 */

var sys = require('sys')
var exec = require('child_process').exec;
var fs = require('fs');

// process.on('uncaughtException', function(err) {
//   console.log(err);
//   process.exit();
// });

exec("xclip -o", {
  encoding: 'utf8',
  timeout: 200
}, function (err, stdout) {
  console.log(arguments);
  if (err) {
    console.log(err);
    return;
  }

  var text = stdout.trim();
  var result = '';
  var locale = undefined;
  var tmpFile = '/tmp/punto.txt';

  var en = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '<', ',', '[', '{',
    ']', '}', "'", '"', '.',  '>', '/', '?', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '&', '^', '$', '#', '@', '`', '~', '|'
  ];

  var ru = [ 'Ф', 'И', 'С', 'В', 'У', 'А', 'П', 'Р', 'Ш', 'О', 'Л', 'Д', 'Ь',
    'Т', 'Щ', 'З', 'Й', 'К', 'Ы', 'Е', 'Г', 'М', 'Ц', 'Ч', 'Н', 'Я', 'Б', 'б',
    'х', 'Х', 'ъ', 'Ъ', 'э', 'Э', 'ю', 'Ю', '.', ',', 'ф', 'и', 'с', 'в', 'у',
    'а', 'п', 'р', 'ш', 'о', 'л', 'д', 'ь', 'т', 'щ', 'з', 'й', 'к', 'ы', 'е',
    'г', 'м', 'ц', 'ч', 'н', 'я', '?', ':', ';', '№', '"', 'ё', 'Ё', '/'
  ];

  console.log('input: ', text);

  if (text.length < 1) {
    console.log('Nothing to convert. Exit');
    return;
  }

  // Define the locale by the first found letter.
  for (l in text) {
    if (/[A-Za-z]/.test(text[l])) {
      locale = en;
      localeOn = ru;
      break;
    }

    if (/[А-Яа-я]/.test(text[l])) {
      locale = ru;
      localeOn = en;
      break;
    }
  }

  // exit, if locale not found
  if (!locale) {
    console.log('locale not found. Exit');
    return;
  }

  [].forEach.apply(text, [function(toChange) {
    var toChangeOn = undefined;
    var i = locale.indexOf(toChange);
    toChangeOn = i === -1 ? undefined : localeOn[i];

    if (!toChangeOn) {
      toChangeOn = toChange;
    }

    result += toChangeOn;
  }]);

  console.log('result: ', result);

  fs.writeFileSync(tmpFile, result);

  exec("xclip -selection c " + tmpFile, {
    encoding: 'utf8',
    timeout: 200
  }, function (err, stdout, stderr) {
    if (err) {
      console.log(err);
      return;
    }

    exec("xdotool key ctrl+v", {
      encoding: 'utf8',
      timeout: 200
    }, function (err, stdout, stderr) {
      if (err) {
        console.log(err);
      }
    });
  });
});
