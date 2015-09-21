
import fs from 'fs-extra';
import bcrypt from 'bcrypt';

const usersFile = 'data/users.json';

let users = [];

export function read() {
  if (users.length > 0) {
    return;
  }

  try {
    users = fs.readJsonSync(usersFile);

  } catch (e) {}
}

export function write() {
  fs.writeJson(usersFile, users, function (err) {
    if (err) {
      console.log(err);
      return false;

    } else {
      return true;
    }
  });
}

export function getUser(email) {
  read();

  for (let i = 0; i < users.length; i++) {
    if (users[i].email == email) {
      return users[i];
    }
  }
}

export function saveUser(user) {
  read();

  if (typeof user.email === 'undefined') {
    throw new Error('Email must be defined.');
  }

  user.email = user.email.toLowerCase();

  if (user.password) {
    let salt = bcrypt.genSaltSync(10);
    user.hashedPassword = bcrypt.hashSync(user.password, salt);
    delete user.password;
  }

  for (let i = 0; i < users.length; i++) {
    if (users[i].email == user.email) {
      users[i] = user;
      write();
      return;
    }
  }

  users.push(user);
  write();
}

export function checkPassword(password, user) {
  if (typeof user.hashedPassword === 'undefined') {
    return false;
  }

  return bcrypt.compareSync(password, user.hashedPassword);
}
