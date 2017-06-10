/*
 * Write a function WITH NO CALLBACKS that,
 * (1) reads a GitHub username from a `readFilePath`
 *     (the username will be the first line of the file)
 * (2) then, sends a request to the GitHub API for the user's profile
 * (3) then, writes the JSON response of the API to `writeFilePath`
 *
 * HINT: We exported some similar promise-returning functions in previous exercises
 */

var fs = require('fs');
var Promise = require('bluebird');
var request = require('request');
var promisified = require('./promisification');
var promiseConstructs = require('./promiseConstructor');

var fetchProfileAndWriteToFile = function(readFilePath, writeFilePath) {
  return new Promise((resolve, reject) => {
    return fs.readFile(readFilePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString().split('\n')[0]);
      }
    });
  }).then((username) => {
    console.log('chained ', username);
    return new Promise((resolve, reject) => {
      request.get( {
        url: 'https://api.github.com/users/' + username,
        headers: { 'User-Agent': 'request' },
        json: true
      }, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
  }).then((content) => {
    console.log(content);
    fs.writeFile(writeFilePath, JSON.stringify(content));
  }).catch((err) => console.log(err));
};
/*
var fetchProfileAndWriteToFile = function(readFilePath, writeFilePath) {
  return promiseConstructs.pluckFirstLineFromFileAsync(readFilePath).then(user => promisified.getGitHubProfileAsync(user)).then(content => fs.writeFile(writeFilePath, content));
  //console.log(promisified.getGitHubProfileAsync);
  //console.log(promiseConstructs.pluckFirstLineFromFileAsync(readFilePath).then(user => promisified.getGitHubProfileAsync(user)).then());
  var nameLogger = function (name) {
    console.log(name);
  };
  console.log(typeof promiseConstructs.pluckFirstLineFromFileAsync);
  console.log(typeof promiseConstructs.pluckFirstLineFromFileAsync(readFilePath));
  //console.log('inside fetchProfileAndWriteToFile');
  let username; 
  let profile;
  let getUsernameFromFileAsync = new Promise( () => {
    fs.readFile(readFilePath, (err, data) => {
      if (err) {
        console.log('read file ', err);
      } else {
        username = data.toString().split('\n')[0];
        console.log(username);
      }
    });   
  });
  console.log(getUsernameFromFileAsync());
  getUsernameFromFileAsync().then(() => {
    console.log('inside then ', username);
    request('https://api.github.com', { method: 'get' }, (err, response, body) => {
      if (err) {
        console.log('api request ', err);
      } else {
        profile = response;
      }
    });
    console.log(profile);
  })//.then(fs.writeFile(writeFilePath))
;
};
*/

// Export these functions so we can test them
module.exports = {
  fetchProfileAndWriteToFile: fetchProfileAndWriteToFile
};

