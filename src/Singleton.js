export default class CommonDataManager {

    static myInstance = null;

    _user = null;
    _profile = null;

    /**
     * @returns {CommonDataManager}
     */
    static getInstance() {
        if (CommonDataManager.myInstance == null) {
            CommonDataManager.myInstance = new CommonDataManager();
        }

        return this.myInstance;
    }


    // Getter Setter of USER

    getUser() {
        return this._user;
    }

    setUser(res) {
        this._user = res;
    }

    // Getter Setter of PROFILE

    getProfile() {
        return this._profile;
    }

    setProfile(res) {
        this._profile= res;
    }
}
