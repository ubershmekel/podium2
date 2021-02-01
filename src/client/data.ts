// This file stores stuff in browser local storage

const keys = {
  username: 'username',
  userId: 'user-id',
}

export function guidGenerator() {
  // https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
  var S4 = function() {
    // 4 random hex characters
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export function getOrGenerateUserId() {
  let uid = window.localStorage.getItem(keys.userId);
  if (!uid) {
    uid = guidGenerator();
    window.localStorage.setItem(keys.userId, uid);
  }
  return uid;
}

export function getName() {
  const username = window.localStorage.getItem(keys.username);
  if (username) {
    return username;
  } else {
    return 'mynameis?';
  }
}

export function saveName(username: string) {
  window.localStorage.setItem(keys.username, username);
}
