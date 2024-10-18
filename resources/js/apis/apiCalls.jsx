import axios from "axios";
const checkDatabase = () => {
    return new Promise((resolve, reject) => {
        axios.post("login/getstores").then((data) => {
            resolve(data);
        });
    });
};

const doLogin = (values) => {
    return new Promise((resolve, reject) => {
        axios.post("login/dologin", values).then((data) => {
            resolve(data);
        });
    });
};

const postData = (url, data) => {
    return new Promise((resolve, reject) => {
        axios
            .post(url, data)
            .then((response) => {
                resolve(response.data);
            })
            .catch((e) => {
                reject(e.response.data);
            });
    });
};

const getData = (url) => {
    return new Promise((resolve, reject) => {
        axios.get(url).then((response) => {
            resolve(response.data);
        });
        // .catch((e) => {
        //   if (e.response.status === 500) {
        //     reject(e.response.data);
        //   }
        // });
    });
};

export { checkDatabase, doLogin, getData, postData };
