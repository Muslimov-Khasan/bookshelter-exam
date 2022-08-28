const list =$(".books__section")
const bookItem =$(".books__section--item")
const selectList =$(".main__left--list")
const selectTemlate =$("#select__template");
const bookTemlate = $("#book__template");
const cardTemplate = $("#card")
const cardList = $(".info__card")
const overlay = $(".overlay")
const input = $(".header__left--input")
const elLogOutBtn = $(".header__logout--btn");
const elSortBtn = $(".search__section--sorting");
const selectCollect = []
let storage = window.localStorage

let and = "&"
let lists = 1;
// API fetch

let change = (lists - 1) * 15 + 1;
let API = async() => {
    change = (lists - 1) * 15 + 1;
    let dataBase = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=15&startIndex=${change}${and}`)
    let base = await dataBase.json()
    let data = base.items
    renderSectionss(data)
    renderData(data, list, cardList, base)
    storage.setItem("selectCollect", JSON.stringify(selectCollect))
}

function backgroundChek() {
    const chkbx = document.getElementById('chkbx');

    chkbx.addEventListener('change', () => {
    if (chkbx.checked) {
        document.body.style.backgroundColor = '#000';
    } else {
        document.body.style.backgroundColor = '#fff';
    }
})
}
backgroundChek();

input.addEventListener("change", () => {
    search = input.value
    input.value = null
    API()
})

/////// SORT

elSortBtn.addEventListener("click", function () {
    and = "&";
    and += "orderBy=newest";
    API(); 
});


let renderData = (data, list, cardList) => {
    list.innerHTML = null
    data.forEach(item => {
        let cloneBookTemplate = bookTemlate.content.cloneNode("true")
        cloneBookTemplate.querySelector(".books__section--item-center-book").textContent = ` ${item.volumeInfo.title.length < 25 ? item.volumeInfo.title : item.volumeInfo.title.split(" ").slice(0,2).join(" ")}... `
        cloneBookTemplate.querySelector(".books__section--item-center-author").textContent = ` ${item.volumeInfo.authors} `
        cloneBookTemplate.querySelector(".book__img").src = `${ item.volumeInfo.imageLinks.thumbnail }`
        cloneBookTemplate.querySelector(".books__section--item").id = `${item.id}`
        cloneBookTemplate.querySelector(".bookmark").dataset.id = `${item.id}`
        cloneBookTemplate.querySelector(".more_info").dataset.id = `${item.id}`
        cloneBookTemplate.querySelector(".read").href = `${item.volumeInfo.previewLink}`
        cloneBookTemplate.querySelector(".data-book").textContent = `${item.volumeInfo.publishedDate}`
        cloneBookTemplate.querySelector(".read").target = "_blank"
        
        let moreInfoBtn = cloneBookTemplate.querySelector(".more_info")
        moreInfoBtn.onclick = () => {
            cardList.classList.remove("card-hidden")
            overlay.classList.remove("overlay-hidden")
            cardList.innerHTML = null;
            let cloneCard = cardTemplate.content.cloneNode("true")
            cloneCard.querySelector(".info__card--title").textContent = `${item.volumeInfo.title.length < 25 ? item.volumeInfo.title : item.volumeInfo.title.split(" ").slice(0,2).join(" ")}`
            cloneCard.querySelector(".info__card--bookImage").src = `${item.volumeInfo.imageLinks.thumbnail}`
            cloneCard.querySelector(".info__card--text").textContent = `${item.volumeInfo.description}`
            cloneCard.querySelector(".info__card--item-authorName1").textContent = `${item.volumeInfo.authors}`
            cloneCard.querySelector(".info__card--item-year").textContent = `${item.volumeInfo.publishedDate}`
            cloneCard.querySelector(".info__card--item-publishersName").textContent = `${item.volumeInfo.publisher}`
            cloneCard.querySelector(".info__card--item-category").textContent = `${item.volumeInfo.categories}`
            cloneCard.querySelector(".info__card--item-page").textContent = `${item.volumeInfo.pageCount}`
            cloneCard.querySelector(".read__card").href = `${item.volumeInfo.previewLink}`
            cloneCard.querySelector(".read__card").target = "_blank"
            
            let closeBtn = cloneCard.querySelector(".close__btn")
            closeBtn.addEventListener("click", () => {
                cardList.classList.add("card-hidden")
                overlay.classList.add("overlay-hidden")
            })
            cardList.appendChild(cloneCard)
        }
        
        list.appendChild(cloneBookTemplate)
        
    })
    
}
let renderSections = (arr, element) => {
    let fragment = document.createDocumentFragment()
    arr.forEach(item => {
        let cloneSelectTemplate = selectTemlate.content.cloneNode("true")
        cloneSelectTemplate.querySelector("#book__name").textContent = `${ item.volumeInfo.title }`
        cloneSelectTemplate.querySelector(".book__author").textContent = `${ item.volumeInfo.authors }`
        cloneSelectTemplate.querySelector(".book__delete").dataset.id = `${item.id}`
        fragment.append(cloneSelectTemplate)
    })
    storage.setItem(".books", JSON.stringify(localBookmark))
    element.append(fragment)
}
let localBookmark = JSON.parse(storage.getItem("selectCollect"));

let renderSectionss = (data) => {
    list.addEventListener("click", (evt) => {
        if (evt.target.matches(".bookmark")) {
            let foundIndex = data.find((item) => item.id === evt.target.dataset.id)
            console.log(foundIndex);
            if (!selectCollect.includes(foundIndex)) {
                selectCollect.push(foundIndex)
                selectList.innerHTML = null;
                renderSections(selectCollect, selectList)
                storage.setItem("selectCollect", JSON.stringify(selectCollect))
            }
        }
    })
}



selectList.addEventListener("click", evt => {
    if (evt.target.matches(".book__delete")) {
        let foundIndex = selectCollect.findIndex(item => evt.target.dataset.id === item.id)
        selectCollect.splice(foundIndex, 1)
        selectList.innerHTML = null
        renderSections(selectCollect, selectList)
        storage.setItem("selectCollect", JSON.stringify(selectCollect))
    }
})
