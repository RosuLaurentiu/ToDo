const newList = document.getElementById("newList");
const container = document.querySelector(".container");
const listTitle = document.getElementById("title")
let letText = listTitle.value

let listNumber = 0;

function createList(x) {





    const oneList = document.createElement("section");
    container.appendChild(oneList);
    oneList.setAttribute("class", "list");

    const topList = document.createElement("div")
    topList.setAttribute("class", "topList")
    oneList.appendChild(topList)

    const title = document.createElement("h1")
    title.setAttribute("class", "title")
    title.innerHTML = x
    topList.appendChild(title)
    listTitle.value = "";

    const removeList = document.createElement("i");
    removeList.setAttribute("class", "fa-solid fa-trash");
    topList.appendChild(removeList);

    const inputDiv = document.createElement("div");
    oneList.appendChild(inputDiv);
    inputDiv.setAttribute("class", "inputDiv");

    const input = document.createElement("input");
    input.setAttribute("class", "input");
    inputDiv.appendChild(input);

    const submit = document.createElement("button");
    submit.setAttribute("class", "newItem");
    submit.innerHTML = "Submit";
    inputDiv.appendChild(submit);

    const itemContainer = document.createElement("div");
    oneList.appendChild(itemContainer);
    itemContainer.setAttribute("class", "itemContainer");

    submit.addEventListener("click", (y) => {

        y = input.value;
        let text = y

        if (text.trim() !== "") {

            console.log(y);

            const listItem = document.createElement("div");
            listItem.setAttribute("class", "items");
            itemContainer.appendChild(listItem);

            const item = document.createElement("h2");
            item.innerHTML = text;
            listItem.appendChild(item);

            const tools = document.createElement("div");
            tools.setAttribute("class", "tools");
            listItem.appendChild(tools);

            const edit = document.createElement("i");
            edit.setAttribute("class", "fa-solid fa-pen-to-square");
            tools.appendChild(edit);

            const remove = document.createElement("i");
            remove.setAttribute("class", "fa-solid fa-trash");
            tools.appendChild(remove);

            input.value = "";

            const newInput = document.createElement("input");
            newInput.setAttribute("class", "input");

            edit.addEventListener("click", () => {

                if (edit.classList.contains("editing")) {
                    // Save the changes
                    let newText = newInput.value;
                    item.innerHTML = newText;
                    listItem.replaceChild(item, newInput);
                    edit.classList.remove("editing");
                } else {
                    // Edit the item
                    let oldText = item.innerHTML;
                    newInput.value = oldText;
                    listItem.replaceChild(newInput, item);
                    edit.classList.add("editing");
                }
            });
            remove.addEventListener("click", () => {
                listItem.remove();
            })

        }
    });


    removeList.addEventListener("click", () => {
        oneList.remove()
    });




};





newList.addEventListener("click", () => {

    if (localStorage.getItem("lists") == null) {
        localStorage.setItem("lists", JSON.stringify([]));
    }

    let storageArray = JSON.parse(localStorage.getItem("lists"));

    while (true) {
        let idExist = false
        for (let i = 0; i < storageArray.length; i++) {
            let obj = storageArray[i];
            if (obj.id === listNumber) {
                idExist = true
                listNumber++
                break;
            }
        }
        if (!idExist) {
            break;
        }
    }

    letText = listTitle.value
    createList(letText)
    let list = {
        id: listNumber,
        title: letText,
        items: []
    }

    let lists = JSON.parse(localStorage.getItem("lists")) || []
    lists.push(list)
    localStorage.setItem("lists", JSON.stringify(lists))
    console.log("New list created with id: " + listNumber)
    listNumber++

    y = "ceva"

})


function getLists() {
    let storageArray = JSON.parse(localStorage.getItem("lists"));

    storageArray.forEach(function (obj) {
        createList(obj.title);
    });
}
getLists()
