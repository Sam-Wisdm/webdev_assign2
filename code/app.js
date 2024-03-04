var slide_idx = 0;          // slide index
var pageNo = 0;             // page index
var slideArr = [];          // array of slides
var postArr = [];           // array of posts
var filterPosts = [];       // array of filtered posts through search

window.onload = () => {
    // slider 
    setInterval(set_slide, 3500);

    fetch('./slides.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            slideArr = data;
            document.getElementById('slider').style.backgroundImage = "url(" + slideArr[slide_idx % slideArr.length].img + ")";
        });
    
    // posts 
    fetch('./posts.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            postArr = data.posts;
            filterPosts = postArr;
            post(0, postArr);
            numOfPages(postArr, pageNo);
            selectPageBgColor(pageNo, postArr);
        })
}

// to change slides automatically
function set_slide() {
    var img = document.getElementById('slider');
    img.style.backgroundImage = "url(" + slideArr[slide_idx++ % slideArr.length].img + ")";
}

// slide back 
const prev = () => {
    if (slide_idx < 0) slide_idx += slideArr.length + 1;
    slide_idx--;
    document.getElementById('slider').style.backgroundImage = "url(" + slideArr[slide_idx % slideArr.length].img + ")";
}

// slide forward 
const next = () => {
    if (slide_idx >= slideArr.length) slide_idx = slide_idx % slideArr.length;
    slide_idx++;
    document.getElementById('slider').style.backgroundImage = "url(" + slideArr[slide_idx % slideArr.length].img + ")";
}

function numOfPages(postArr, pgidx){
    let total_pages = Math.ceil(postArr.length / 4);
    let pg = ``;
    // pg += `<div id="prev-pg" onclick="prevPg(${pgidx})">
    //             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="black">
    //                 <text x="12" y="16" text-anchor="middle" font-size="30" font-weight="bold">&#8592;</text>
    //             </svg>
    //         </div>`
    for(let i = 0; i< total_pages; i++){
        pg += `<div class="pageStyle" id="page${i}" onclick="changePage(${i})">${i+1}</div>`;
    }
    // pg += `<div id="next-pg" onclick="nextPg(${pgidx})">
    //             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="black">
    //                 <text x="12" y="16" text-anchor="middle" font-size="30" font-weight="bold">&#8594;</text>
    //             </svg>
    //         </div>`
    document.getElementById('pagination').innerHTML = pg;
}

function nextPg(pgidx){
    if(pgidx+1 < postArr.length){
        pageNo = pgidx+1;
        post(pageNo, filterPosts);
        selectPageBgColor(pageNo, filterPosts);
    }
}

function prevPg(pgidx){
    if(pgidx > 0){
        pageNo = pgidx-1;
        post(pageNo, filterPosts);
        selectPageBgColor(pageNo, filterPosts);
    }
}

function changePage(pgidx){
    pageNo = pgidx;
    post(pageNo, filterPosts);
    selectPageBgColor(pageNo, filterPosts);
}

function selectPageBgColor(pgidx, postArr) {
    if (postArr.length > 0) {
        let selectedPage = document.getElementById(`page${pgidx}`);
        if (selectedPage) {
            console.log(selectedPage);
            selectedPage.style.backgroundColor = '#667eea';
            selectedPage.style.color = 'white';

            let total_pages = Math.ceil(postArr.length / 4);
            for (let i = 0; i < total_pages; i++) {
                if (i === pgidx) continue;
                let otherPage = document.getElementById(`page${i}`);
                if (otherPage) {
                    otherPage.style.backgroundColor = '#f6f9fd';
                    otherPage.style.color = '#4c51bf';
                }
            }
        } else {
            console.error(`Element with id "page${pgidx}" not found.`);
        }
    } else {
        console.error("postArr is empty.");
    }
}

function post(pgidx, postArr) {
    let allPost = ``;
    let row = ``;

    if (postArr.length) {
        for (let i = pgidx * 4; i < pgidx * 4 + 4; i++) {
            if (i >= postArr.length) {
                break; // Break loop if no more posts available
            }

            const d = new Date(0);
            d.setUTCSeconds(postArr[i].datetime);
            console.log(d);

            allPost += `<div class="col col-mobile">
                            <div class="col-a" id="demo" style="background-image: url(${postArr[i].img});">
                                <div class="travel"> LIFESTYLE </div>
                            </div>
                            <div class="content">
                                <h2 class="article-heading">${postArr[i].title}</h2>
                                <div class="date-comment">
                                    <p class="date">${d.toString().substring(4, 21)} / : <span class="author">${postArr[i].author}</span></p>
                                    <p class="comment">${postArr[i].comment_count} comments</p>
                                </div>
                                <p class="desc">
                                    ${postArr[i].desc}
                                </p>
                            </div>
                        </div>`;

            if (i & 1 === 1 || i === postArr.length - 1) {
                row += `<div class="row row-mobile">${allPost}</div>`;
                allPost = '';
            }
        }
    }
    document.getElementById('cards').innerHTML = row;
}

// search 
function search() {
    let search_key = document.getElementById('search-box').value;
    filterPosts = [];

    postArr.forEach(item => {
        let findTitle = item.title.toLowerCase().search(search_key.toLowerCase());
        let findDesc = item.desc.toLowerCase().search(search_key.toLowerCase());
        let findAuthor = item.author.toLowerCase().search(search_key.toLowerCase());
        if((findTitle != -1) || (findDesc != -1) || (findAuthor != -1)){
            filterPosts.push(item);
        }
    })

    post(pageNo, filterPosts);
    numOfPages(filterPosts, pageNo);
    selectPageBgColor(pageNo, filterPosts);
}

