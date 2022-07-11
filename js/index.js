import { getData } from "./module.js";

const preloader = document.querySelector('.loader');
const posts_list = document.querySelector('.post-list');
const search_input = document.querySelector('#search-input');
const pagination_element = document.querySelector('.pagination');

function SetupPagination (items, wrapper, rows_per_page, current) {
	wrapper.innerHTML = "";

	let page_count = Math.ceil(items.length / rows_per_page);
	for (let i = 1; i < page_count + 1; i++) {
		let btn = PaginationButton(i, items, current, rows_per_page);
		wrapper.appendChild(btn);
	}
};

function PaginationButton (page, items, current, rows) {
	let button = document.createElement('button');
	button.innerText = page;
  button.classList.add('pagination-btn')

	if (current == page) button.classList.add('active');

	button.addEventListener('click', () => {
		current = page;
		DisplayList(items, posts_list, rows, current);

		let current_btn = document.querySelector('.active');
		current_btn.classList.remove('active');

		button.classList.add('active');
	});

	return button;
}

function DisplayList(items, wrapper, rows_per_page, page){
  wrapper.innerHTML = '';
  page--;

  let start = rows_per_page * page;
  let end = start + rows_per_page;
  let paginatedItems = items.slice(start, end);

  paginatedItems.forEach(item => {
    let elem = document.createElement('li');
    elem.classList.add('post');

    elem.innerHTML = `
      <div>
        <h1>${item.author}</h1>
        <h2>${item.title}</h2>
      </div>`;

    elem.addEventListener('click', () => {
      window.open('postpage.html?post=' + item.id);
    })

    wrapper.append(elem);
  });
};

function filterById(authors, posts){
  let result = [];

  posts.forEach(post => {
    const author = authors.find(item => 
      item.id === post.userId
    );

    result.push({
      id: post.id,
      author: author.username,
      title: post.title
    })
  });

  return result
}

function SearchPosts(items, value, current, rows){
  if(value !== ''){
    let result = items.filter(elem => {
      if(Object.values(elem).join('').includes(value)){
        return elem
      }
    });

    if(!result.length){
      return(
        pagination_element.innerHTML = '',
        posts_list.innerHTML = '<h1>Nothing</h1>'
      )
    }
    DisplayList(result, posts_list, rows, current);
    SetupPagination(result, pagination_element, rows, current);
  }else{
    DisplayList(items, posts_list, rows, current);
    SetupPagination(items, pagination_element, rows, current);
  }
}

async function renderData(){
  let current_page = 1;
  let rows = 5;

  try{
    preloader.style.display = 'block';

    const [users, posts] = await Promise.all([getData('/users'), getData('/posts')]);
    const res = filterById(users, posts);
  
    DisplayList(res, posts_list, rows, current_page);
    SetupPagination(res, pagination_element, rows, current_page);

    search_input.addEventListener('input', (e) => {
      e.preventDefault();
      const value = search_input.value.trim();
  
      SearchPosts(res, value, current_page, rows)
    })
  }catch(e){
    console.error(e);
    search_input.disabled = true;
  }finally{
    preloader.style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', renderData())