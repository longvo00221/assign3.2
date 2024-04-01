import FollowList from "./followlist.js";
import User, { Post } from "./user.js";

export default class App {
  constructor() {
    /* Store the currently logged-in user. */
    this._user = null;
    this._loginForm = document.querySelector("#loginForm");
    this._profileForm = document.querySelector("#editPanel");
    this._postForm = document.querySelector("#postForm");
    this._followContainer = document.querySelector("#followContainer");

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

  /*** Event handlers ***/
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
    let usersStr = users.join("\n");
    alert(`List of users:\n\n${usersStr}`);
  }

  _displayFeed(feed) {
    document.querySelector("#feed").innerHTML = ""; // Xóa feed hiện tại
    feed.forEach((post) => {
      this._displayPost(post);
    });
  }
  _displayPost(post) {
    let template = document.querySelector("#templatePost");
    template.style.display = "block";
    template.querySelector(".avatar").src = post.user.avatarURL;
    template.querySelector(".name").textContent = post.user.name;
    template.querySelector(".userid").textContent = post.user.id;
    template.querySelector(".time").textContent = post.time.toLocaleString();
    template.querySelector(".text").textContent = post.text;
    document.querySelector("#feed").appendChild(template);
  }

  /* Load (or reload) a user's profile. Assumes that this._user has been set to a User instance. */
  async _loadProfile() {
    document.querySelector("#welcome").classList.add("hidden");
    document.querySelector("#main").classList.remove("hidden");
    document.querySelector("#idContainer").textContent = this._user.id;

    // Cập nhật thông tin hồ sơ
    this._profileForm.querySelector("#nameInput").value = this._user.name;
    this._profileForm.querySelector("#avatarInput").value =
      this._user.avatarURL;

    // Hiển thị danh sách theo dõi
    this._followList.setList(this._user.following);

    // Lấy feed của người dùng
    try {
      let feed = await this._user.getFeed();
      this._displayFeed(feed);
    } catch (error) {
      console.error("Error loading user feed:", error);
    }
  }
}
