import { getData, removeData} from "./module.js";

const main = document.querySelector('.main-container');
const preloader = document.querySelector('.loader');

const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('post');

async function deletePost(id, wrapper){
  preloader.style.display = 'block';

  const res = await removeData('/posts', id);
  if(res.ok){
    wrapper.innerHTML = '<h1>Post has been deleted!</h1>';
  }

  preloader.style.display = 'none';
}

function createPost(wrapper, item){
  let mainpost = document.createElement('div');
  mainpost.classList.add('page-post');

  mainpost.innerHTML = `
    <div class='post-body'>
      <h1>${item.title}</h1>
      <p>${item.body}</p>
    </div>
    <div class='post-bottom'>
      <h2>by ${item.author}</h2>
      <a href="mailto:${item.email}">
        ${item.email}
      </a>
      <button>Delete Post</button>
    </div> `;

  wrapper.append(mainpost);

  mainpost.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON'){
      deletePost(item.id, wrapper)
    }
  })
}

async function renederData(){
  try{
    preloader.style.display = 'block';

    const post = await getData('/posts' + `/${id}`);
    const author = await getData('/users' + `/${post.userId}`);

    const result = {
      id: post.id,
      title: post.title,
      body: post.body,
      author: author.name,
      email: author.email
    };

    createPost(main, result);
  }catch(e){
    console.error(e);
    main.innerHTML = "<h1>Error</h1>"
  }finally{
    preloader.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', renederData())