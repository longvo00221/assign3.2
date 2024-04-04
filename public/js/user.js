import apiRequest from "./apirequest.js";
export class Post {
  constructor(data) {
    this.userId = data.userId;
    this.time = new Date(data.time);
    this.text = data.text;
  }
}
export default class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.avatarURL = data.avatarURL;
    this.following = data.following || [];
  }
  static async listUsers() {
    let data = await apiRequest("GET", "/users");
    return data.users;
  }
  static async loadOrCreate(id) {
    let res = await fetch(`/api/users/${id}`);
    let data = await res.json();
    if (data) {
      return new User(data);
    } else {
      let newUser = new User({ id: id });
      await newUser.save();
      return newUser;
    }
  }

  toString() {
    return this.name;
  }

  toJSON() {
    return {
      name: this.name,
      avatarURL: this.avatarURL,
    };
  }

  async save() {
    try {
      await apiRequest("PATCH", `/users/${this.id}`, {
        name: this.name,
        avatarURL: this.avatarURL,
      });
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  }
  async getFeed() {
    try {
      let data = await apiRequest("GET", `/users/${this.id}/feed`);
    
      return data.map((postData) => {
        return new Post(postData);
      });
    } catch (error) {
      console.error("Error getting user feed:", error);
      throw error;
    }
  }
  async makePost(text) {
    try {
      await apiRequest("POST", `/users/${this.id}/posts`, { text });
    } catch (error) {
      console.error("Error making post:", error);
      throw error;
    }
  }
  async addFollow(id) {
    try {
      await apiRequest("POST", `/users/${this.id}/follow`, { id });
      this.following.push(id);
    } catch (error) {
      console.error("Error adding follow:", error);
      throw error;
    }
  }
  async deleteFollow(id) {
    try {
      await apiRequest("DELETE", `/users/${this.id}/follow`, { id });
      this.following = this.following.filter((followId) => followId !== id);
    } catch (error) {
      console.error("Error deleting follow:", error);
      throw error;
    }
  }
  async changeProfile(name, avatar) {
    this.name = name;
    this.avatarURL = avatar;
    try {
      await apiRequest("PATCH", `/users/${this.id}`, {
        name: this.name,
        avatarURL: this.avatarURL,
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  }
  static async listUsers() {
    const response = await fetch("/api/users");
    const users = await response.json();
    const simplifiedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
    }));

    return simplifiedUsers;
  }
}
