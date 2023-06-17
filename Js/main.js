let nameInput = document.getElementById("name")
let categoryOptions = document.querySelectorAll(".category-option")
let code = document.getElementById("code")
let total = document.querySelector(".total")
let container = document.querySelector(".container")
let expiredList = document.querySelector(".expired-list")

let searchInput = document.getElementById("search")

// Helpers
let mood = 'create'
let tmp;
// Btns
let createBtn = document.querySelector(".create")

// Show Popup 

function showPopup(message, bg) {
    const popup = document.createElement('h2');
    popup.classList.add('popup');
    popup.textContent = message;
    popup.style.background = bg
    container.prepend(popup);
    setTimeout(() => {
        popup.remove();
    }, 2000);
}




// Save Localstorage

let dataClients = JSON.parse(localStorage.client || "[]");


// Call The Create Function
createBtn.onclick = createClient;
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        createClient()
    }
});

// Category Options Handle Active
categoryOptions.forEach(option => {
    option.addEventListener("click", function () {
        categoryOptions.forEach(option => {
            option.classList.remove("active")
        })
        this.classList.add("active")
    })
})

// Create 

function createClient() {
    let currentDate = new Date();
    let endDate = new Date();
    endDate.setMonth(currentDate.getMonth() + 1);
    let category = document.querySelector(".category-option.active").textContent;
    let price = document.querySelector(".category-option.active").dataset.price;
    let newClient = {
        name: nameInput.value.toLowerCase(),
        category: category,
        code: code.value,
        bDate: currentDate.toLocaleDateString(),
        eDate: endDate.toLocaleDateString(),
        price: price,

    };

    if (nameInput.value !== '' && code.value !== '') {
        if (mood == 'create') {
            dataClients.push(newClient)
            showPopup("Client Added", "#0a74a8")

        } else {
            dataClients[tmp] = newClient
            mood = 'create'
            createBtn.innerHTML = 'Add Client'
            showPopup("Client Updated", "#0a74a8")

        }
        clearFields()


    } else {
        showPopup("Please fill in all fields", "#f00")
    }

    localStorage.client = JSON.stringify(dataClients)
    renderData()

}

// Clear Input Values


function clearFields() {
    nameInput.value = ''
    code.value = ''
    categoryOptions.forEach(option => {
        option.classList.remove("active")
    })
}


// Render Data 

function renderData() {
    let output = ''
    let expiredOutput = ''
    let currentDate = new Date()

    for (let i = 0; i < dataClients.length; i++) {
        let endDate = new Date(dataClients[i].eDate)
        if (endDate <= currentDate) {
            expiredOutput += `
            <li>${dataClients[i].name} --- ${dataClients[i].code}</li>
            `
        }
        output += `
            <tr>
                <td>${i + 1}</td>
                <td>${dataClients[i].name}</td>
                <td>${dataClients[i].code}</td>
                <td>${dataClients[i].category}</td>
                <td>${dataClients[i].bDate}</td>
                <td>${dataClients[i].eDate}</td>
                <td>${dataClients[i].price}</td>
                <td><button onclick="updateClient(${i})"id = "update"><i class="fa-solid fa-pen"></i></button></td>
                <td><button onclick="deleteClient(${i})" id = "delete"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `
    }
    document.querySelector('.tbody').innerHTML = output
    expiredList.innerHTML = expiredOutput
}

renderData()



// Delete Client 

function deleteClient(index) {
    dataClients.splice(index, 1)
    localStorage.client = JSON.stringify(dataClients)
    showPopup("Client Deleted ", "#880707")
    renderData()
}



// Update Client 

function updateClient(index) {
    nameInput.value = dataClients[index].name
    code.value = dataClients[index].code
    categoryOptions.forEach(option => {
        if (option.textContent === dataClients[index].category) {
            option.classList.add("active")
        } else {
            option.classList.remove("active")
        }
    })
    mood = 'update'
    createBtn.innerHTML = 'Update Client'
    tmp = index
    scroll({
        top: "0",
        behavior: "smooth"
    })

    dataClients[index].times = 0
}
// Search Mood 

let searchMood = 'name'

function getSearchMood(id) {
    if (id === 'searchName') {
        searchMood = 'name'
    } else {
        searchMood = 'code'

    }

    searchInput.focus()

    searchInput.placeholder = "Search By" + searchMood.toUpperCase()
}


// Search

function searchData(value) {
    let output = ``

    for (let i = 0; i < dataClients.length; i++) {
        if (searchMood === 'name') {
            if (dataClients[i].name.includes(value.toLowerCase())) {
                output += `
                <tr>
                <td>${i + 1}</td>
                <td>${dataClients[i].name}</td>
                <td>${dataClients[i].code}</td>
                <td>${dataClients[i].category}</td>
                <td>${dataClients[i].bDate}</td>
                <td>${dataClients[i].eDate}</td>
                <td>${dataClients[i].price}</td>
                <td><button onclick="updateClient(${i})"id = "update"><i class="fa-solid fa-pen"></i></button></td>
                <td><button onclick="deleteClient(${i})" id = "delete"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
            </tr>
                `
            }

        } else {
            if (dataClients[i].code.includes(value)) {
                output += `
                <tr>
                <td>${i + 1}</td>
                <td>${dataClients[i].name}</td>
                <td>${dataClients[i].code}</td>
                <td>${dataClients[i].category}</td>
                <td>${dataClients[i].bDate}</td>
                <td>${dataClients[i].eDate}</td>
                <td>${dataClients[i].price}</td>
                <td><button onclick="updateClient(${i})"id = "update"><i class="fa-solid fa-pen"></i></button></td>
                <td><button onclick="deleteClient(${i})" id = "delete"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
            </tr>
                `
            }
        }
    }

    let tbody = document.querySelector(".tbody")

    tbody.innerHTML = output
}


let moodBtn = document.querySelector(".mood-btn")

moodBtn.onclick = function () {
    document.body.classList.toggle("active")
    localStorage.setItem("activeState", document.body.classList.contains("active"))
}

// Check local storage for active state
if (localStorage.activeState === "true") {
    document.body.classList.add("active")
} else {
    document.body.classList.remove("active")
}

