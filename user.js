//Connecting to Different Rooms
//create a receiver in the server, waiting to receive new connection from the client.
let users = [];

exports.addUser = ({ id, name, room }) => {
  if (!name || !room)
  return { error: "Username and room are required." };
  const user = { id, name, room };
  users.push(user);
  return { user };
};
exports.removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  return users[index];
};
