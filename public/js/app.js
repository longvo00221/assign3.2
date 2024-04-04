import FollowList from "./followlist.js";
import User, { Post } from "./user.js";

export default class App {
  constructor() {
    this._user = null;
    this._loginForm = document.querySelector("#loginForm");
    this._profileForm = document.querySelector("#editPanel");
    this._postForm = document.querySelector("#postForm");
    this._followContainer = document.querySelector("#followContainer");
    this._listUsersButton = document.querySelector('button[name="listUsers"]');
    this._listUsersButton.addEventListener(
      "click",
      this._onListUsers.bind(this)
    );
    this._followList = new FollowList(
      this._followContainer,
      this._onFollowAdd.bind(this),
      this._onFollowRemove.bind(this)
    );

    this._loginForm.addEventListener("submit", this._onLogin.bind(this));
    this._profileForm.addEventListener(
      "submit",
      this._onSaveProfile.bind(this)
    );
    this._postForm.addEventListener("submit", this._onMakePost.bind(this));
  }
  async _onChangeProfile(event) {
    event.preventDefault();
    let newName = this._profileForm.querySelector("#nameInput").value;
    let newAvatarURL = this._profileForm.querySelector("#avatarInput").value;

    this._user.name = newName;
    this._user.avatarURL = newAvatarURL;

    try {
      await this._user.changeProfile(newName, newAvatarURL);
      await this._loadProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }
  async _onLogin(event) {
    event.preventDefault();
    let userId = this._loginForm.userid.value;
    this._user = await User.loadOrCreate(userId);
    await this._loadProfile();
  }
  async _onSaveProfile(event) {
    event.preventDefault();
    let newName = this._profileForm.querySelector("#nameInput").value;
    let newAvatarURL = this._profileForm.querySelector("#avatarInput").value;

    this._user.name = newName;
    this._user.avatarURL = newAvatarURL;

    try {
      await this._user.save();
      await this._loadProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }

  async _onMakePost(event) {
    event.preventDefault();
    let text = this._postForm.querySelector("#newPost").value;
    try {
      await this._user.makePost(text);
      await this._loadProfile();
    } catch (error) {
      console.error("Error making post:", error);
    }
  }

  async _onFollowAdd(id) {
    try {
      await this._user.addFollow(id);
      await this._loadProfile();
    } catch (error) {
      console.error("Error adding follow:", error);
    }
  }

  async _onFollowRemove(id) {
    try {
      await this._user.deleteFollow(id);
      await this._loadProfile();
    } catch (error) {
      console.error("Error deleting follow:", error);
    }
  }

  async _onListUsers() {
    let users = await User.listUsers();

    let usersStr = "";
    users.map((user) => {
      usersStr += `${user.id} - ${user.name}\n`;
    });
    alert(`List of users:\n\n${usersStr}`);
  }

  _displayFeed(feed) {
    document.querySelector("#feed").innerHTML = "";
    document.querySelector(".postHeader .name").textContent = this._user.name;
    document.querySelector(".postHeader .userid").textContent = this._user.id;
    document.querySelector("#avatarUser").src = this._user.avatarURL;
    feed.forEach((post) => {
      console.log(post);
      this._displayPost(post);
    });
  }
  async _displayPost(post) {
    let postUser = await User.loadOrCreate(post.userId);
    let template = document.querySelector("#templatePost").cloneNode(true);
    template.style.display = "block";
    template.querySelector(".avatar").src = postUser.avatarURL;
    template.querySelector(".name").textContent = postUser.name;
    template.querySelector(".userid").textContent = postUser.id;
    template.querySelector(".time").textContent = post.time.toLocaleString();
    template.querySelector(".textPost").textContent = post.text;
    document.querySelector("#feed").appendChild(template);
  }

  async _loadProfile() {
    document.querySelector("#welcome").classList.add("hidden");
    document.querySelector("#main").classList.remove("hidden");
    document.querySelector("#idContainer").textContent = this._user.id;
    this._profileForm.querySelector("#nameInput").value = this._user.name;
    this._profileForm.querySelector("#avatarInput").value =
      this._user.avatarURL;
    this._followList.setList(this._user.following);
    await this._loadFollowedUsersFeed();
    try {
      let feed = await this._user.getFeed();

      this._displayFeed(feed);
    } catch (error) {
      console.error("Error loading user feed:", error);
    }
  }
  async _loadFollowedUsersFeed() {
    if (this._user.following.length > 0) {
      for (let followedUserId of this._user.following) {
        let followedUser = await User.loadOrCreate(followedUserId);
        let feed = await followedUser.getFeed();
        this._displayFeed(feed);
      }
    }
  }
}
