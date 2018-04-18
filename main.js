

window.onload = function () {
    getAllTopics();
    addEventListenerToInputChange();
    addEventListenerToTopicBoxClick();
}

const colors = ['red', 'blue', 'dark-blue', 'dark-green', 'light-green', 'dark-maroon', 'green'];
const apiUrl = 'http://learning.us-3.evennode.com/';

// ************* API Calls **************
function getAllTopics() {
    const httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const topics = httpRequest.responseText;
                addTopicsBoxesToDom(JSON.parse(topics));
            } else {
            }
        }
    }

    httpRequest.open('GET', `${apiUrl}/topic`, true);
    httpRequest.send();
}

function getSearchedTopics(searchQuery) {

    const httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const topics = httpRequest.responseText;
                removeCurrentBoxesFromDom();
                addTopicsBoxesToDom(JSON.parse(topics));
            } else {
            }
        }
    }

    httpRequest.open('POST', `${apiUrl}/topic/search`, true);
    httpRequest.setRequestHeader('Content-type', 'application/json');
    httpRequest.send(JSON.stringify({ query: searchQuery }));
}

function getLinksForTopic(topic) {
    const httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const links = httpRequest.responseText;
                removeCurrentCardsFromDom();
                addLinksToDOM(JSON.parse(links));
            } else {
            }
        }
    }

    httpRequest.open('POST', `${apiUrl}/link`, true);
    httpRequest.setRequestHeader('Content-type', 'application/json');
    httpRequest.send(JSON.stringify({ query: topic }));
}



// **************** DOM Manipulation *********************
function addTopicsBoxesToDom(topics) {
    const topicBoxes = document.getElementById('topic-boxes-container');
    const list = document.createElement('div');
    list.className = "topic-boxes";
    topics.forEach(function (topic) {
        const listEle = document.createElement('div');
        listEle.classList.add(colors[topic.length % colors.length], 'topic-box');
        listEle.id = topic;
        listEle.innerHTML = topic;
        list.appendChild(listEle);
    })
    topicBoxes.appendChild(list);
}

function removeCurrentBoxesFromDom() {
    const topicBoxes = document.getElementById('topic-boxes-container');
    while (topicBoxes.hasChildNodes()) {
        topicBoxes.removeChild(topicBoxes.lastChild);
    }
}

function addLinksToDOM(links) {
    const linksContainer = document.getElementById('links-container');
    const linksHeading = document.createElement('h2');
    linksHeading.className = "resource-heading"
    linksHeading.innerText = 'Resources';
    linksContainer.appendChild(linksHeading);
    const list = document.createElement('div');
    list.className = "links";
    links.forEach(function (link) {
        const listEle = makeLinkCard(link);
        list.appendChild(listEle);
    })
    linksContainer.appendChild(list);
}

function makeLinkCard(link) {

    const linkCard = document.createElement('div');
    if (link.link) {
        linkCard.classList.add(colors[link.link.length % colors.length], 'link-card');
        const linkDiv = document.createElement('div');
        linkDiv.classList.add('link-container');
        const linkEle = document.createElement('a');

        linkEle.href = link.link;
        linkEle.innerText = link.desc
        linkDiv.appendChild(linkEle);
        linkCard.appendChild(linkDiv);


    }
    return linkCard;
}

function removeCurrentCardsFromDom() {
    const linksCards = document.getElementById('links-container');
    while (linksCards.hasChildNodes()) {
        linksCards.removeChild(linksCards.lastChild);
    }
}

// ************* Event Listeners ***************
function addEventListenerToInputChange() {
    const input = document.getElementsByClassName('searchInput')[0];
    input.addEventListener('input', handleInputChange);
}

function addEventListenerToTopicBoxClick() {
    const topicBoxContainer = document.getElementById('topic-boxes-container');
    topicBoxContainer.addEventListener('click', handleBoxClick)
}


// ************* Event handlers **************
function handleInputChange(e) {
    getSearchedTopics(e.target.value);
}

function handleBoxClick(e) {
    getLinksForTopic(e.target.id);
}
