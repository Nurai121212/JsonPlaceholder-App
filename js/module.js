export const postUrl = 'https://jsonplaceholder.typicode.com/posts';
export const usersUrl = 'https://jsonplaceholder.typicode.com/users';

const module = {
  getData : async(url) => {
    const res = await fetch(url);
    return res.json();
  },
  deleteData : async(url, id) => {
    const res = await fetch(url + `/${id}`, {
      method: 'DELETE'
    });
    return res;
  }
};

export const getData = module.getData;
export const removeData = module.deleteData;