const newList = document.getElementById("newList");
const container = document.querySelector(".container");
const listTitle = document.getElementById("title");
let letText = listTitle.value;

let listNumber = 0;
let memoreList = 0;
let removeId = 0;
let dataId = 0;
//each list is represented by an id this id represents the position of the list in local storage
//using this id list are created removed edited with an unique id
//data-id represents the items position in each lists items array
// gives unique data-id to all h2 with the same id, looks for new h2 created
function giveDataIdToH2Elements() {
    let h2Elements = document.querySelectorAll("h2");
    let dataIds = {};
    h2Elements.forEach((h2Element) => {
        const id = h2Element.id;
        if (!dataIds[id]) {
            dataIds[id] = 0;
        }
        h2Element.setAttribute("data-id", dataIds[id]);
        dataIds[id]++;
    });

    // Observe new h2 elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === "H2") {
                    h2Elements = document.querySelectorAll("h2");
                    dataIds = {};
                    h2Elements.forEach((h2Element) => {
                        const id = h2Element.id;
                        if (!dataIds[id]) {
                            dataIds[id] = 0;
                        }
                        h2Element.setAttribute("data-id", dataIds[id]);
                        dataIds[id]++;
                    });
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

//creating a list x= title y= id
function createList(x, ly) {
    const oneList = document.createElement("section");
    container.appendChild(oneList);
    oneList.setAttribute("class", "list");
    oneList.setAttribute("id", ly);

    const topList = document.createElement("div");
    topList.setAttribute("class", "topList");
    oneList.appendChild(topList);

    const title = document.createElement("h1");
    title.setAttribute("class", "title");
    title.innerHTML = x;
    topList.appendChild(title);
    listTitle.value = "";

    const removeList = document.createElement("i");
    const place = document.createElement("div");
    place.setAttribute("class", "place");
    place.appendChild(removeList);
    removeList.setAttribute("class", "fa-solid fa-trash");
    removeList.setAttribute("id", ly);
    topList.appendChild(place);

    const inputDiv = document.createElement("div");
    oneList.appendChild(inputDiv);
    inputDiv.setAttribute("class", "inputDiv");

    const input = document.createElement("input");
    input.setAttribute("class", "input");
    inputDiv.appendChild(input);

    const submit = document.createElement("button");
    submit.setAttribute("class", "newItem");
    submit.setAttribute("id", "button:" + ly);
    submit.setAttribute("data-id", ly);
    submit.innerHTML = "Add Item";
    inputDiv.appendChild(submit);
    listNumber++;

    for (let i = 0; i < listNumber; i++) {
        const button = document.getElementById("button:" + i);

        //creates item if input is not empty
        function createItem(y) {
            let text = y;
            let idd = button.getAttribute("data-id");

            if (text.trim() !== "") {
                const itemContainer = document.createElement("div");
                oneList.appendChild(itemContainer);
                itemContainer.setAttribute("class", "itemContainer");

                const listItem = document.createElement("div");
                listItem.setAttribute("class", "items");
                itemContainer.appendChild(listItem);

                const item = document.createElement("h2");
                item.innerHTML = text;
                item.setAttribute("id", idd);
                // item.setAttribute("data-id", dataId);
                dataId++;

                listItem.appendChild(item);

                const tools = document.createElement("div");
                tools.setAttribute("class", "tools");
                listItem.appendChild(tools);

                const edit = document.createElement("i");
                edit.setAttribute("class", "fa-solid fa-pen-to-square");
                edit.setAttribute("id", idd);
                tools.appendChild(edit);

                const remove = document.createElement("i");
                remove.setAttribute("class", "fa-solid fa-trash");
                remove.setAttribute("id", idd);
                tools.appendChild(remove);

                input.value = "";

                const newInput = document.createElement("input");
                newInput.setAttribute("class", "input");

                giveDataIdToH2Elements();

                edit.addEventListener("click", () => {
                    if (edit.classList.contains("editing")) {
                        // Save the changes
                        let newText = newInput.value;
                        item.innerHTML = newText;
                        listItem.replaceChild(item, newInput);
                        edit.classList.remove("editing");
                        let itemId = item.getAttribute("data-id");
                        var objects = JSON.parse(localStorage.getItem("lists"));
                        console.log(
                            "🚀 ~ file: app.js:107 ~ remove.addEventListener ~ objects",
                            objects
                        );
                        objects.forEach((obj) => {
                            if (obj.id == edit.id) {
                                console.log("Replaced");
                                obj.items.splice(itemId, 1, newText);
                                localStorage.setItem("lists", JSON.stringify(objects));
                                return;
                            }
                        });
                    } else {
                        // Edit the item
                        let oldText = item.innerHTML;
                        newInput.value = oldText;
                        listItem.replaceChild(newInput, item);
                        edit.classList.add("editing");
                    }
                });

                remove.addEventListener("click", () => {
                    itemContainer.remove();
                    let itemId = item.getAttribute("data-id");
                    var objects = JSON.parse(localStorage.getItem("lists"));
                    objects.forEach((obj) => {
                        if (obj.id == remove.id) {
                            console.log("Removed");
                            obj.items.splice(itemId, 1);
                            localStorage.setItem("lists", JSON.stringify(objects));
                            giveDataIdToH2Elements();
                            return;
                        }
                    });
                });
            }
        }

        if (button !== null) {
            button.addEventListener("click", () => {
                let lists = JSON.parse(localStorage.getItem("lists")) || [];
                let text = input.value;

                if (text.trim() !== "") {
                    lists[i].items.push(text);
                    localStorage.setItem("lists", JSON.stringify(lists));
                    createItem(text);
                }
            });
        }
    }

    removeId++;

    removeList.addEventListener("click", () => {
        oneList.remove();
        listNumber--;
        console.log(removeList.id);
        // Get the array of objects from local storage
        let idToRemove = removeList.id;

        // Get the array of objects from local storage
        var objects = JSON.parse(localStorage.getItem("lists"));
        if (objects.length > idToRemove) {
            objects.splice(idToRemove, 1);

            // Update the array in local storage
            localStorage.setItem("lists", JSON.stringify(objects));
        } else {
            var indexToRemove = objects.findIndex(function (obj) {
                return obj.id === idToRemove;
            });

            // Remove the object from the array
            objects.splice(indexToRemove, 1);

            // Update the array in local storage
            localStorage.setItem("lists", JSON.stringify(objects));
        }
    });

    giveDataIdToH2Elements();

    return createItem;
}

//

newList.addEventListener("click", () => {
    //if local storage is empty create an array
    if (localStorage.getItem("lists") == null) {
        localStorage.setItem("lists", JSON.stringify([]));
    }

    let storageArray = JSON.parse(localStorage.getItem("lists"));

    //checks if id of list exists 
    while (true) {
        let idExist = false;
        for (let i = 0; i < storageArray.length; i++) {
            let obj = storageArray[i];
            if (obj.id === memoreList) {
                idExist = true;
                memoreList++;

                break;
            }
        }
        if (!idExist) {
            break;
        }
    }
    letText = listTitle.value;
    createList(letText, memoreList);

    let list = {
        id: memoreList,
        title: letText,
        items: []
    };

    let lists = JSON.parse(localStorage.getItem("lists")) || [];
    lists.push(list);
    localStorage.setItem("lists", JSON.stringify(lists));
    console.log("New list created with id: " + memoreList);
    memoreList++;
});

function getLists() {
    // Check if the "lists" key exists in local storage
    if (localStorage.getItem("lists") != null) {
        // Get the array of objects from local storage
        let storageArray = JSON.parse(localStorage.getItem("lists"));

        // Loop through each object in the array
        for (let i = 0; i < storageArray.length; i++) {
            let obj = storageArray[i];

            // Assign an ascending id to each object, starting from 0
            obj.id = i;

            // Call the `createList` function, passing the object's title and id
            const myF = createList(obj.title, obj.id);

            // Get the array of items from the object
            let itemsArray = obj.items;

            // Loop through each item in the items array
            itemsArray.forEach(function (item) {
                // Call the `myF` function, passing each item
                myF(item);
            });
        }

        // Update the array in local storage with the updated objects
        localStorage.setItem("lists", JSON.stringify(storageArray));
    }
}
getLists();
