const readMoreButton = document.getElementById('read-more-btn');
const readLessButton = document.getElementById('read-less-btn');
const content = document.getElementById('content');
const table = document.getElementById('table-body');
const select = document.getElementById('state-select');
const republicanCheckbox = document.getElementById('republican');
const independantCheckbox = document.getElementById('independant');
const democratCheckbox = document.getElementById('democrat');
const noResults = document.getElementById('no-results');
const senateApi = 'https://api.propublica.org/congress/v1/113/senate/members.json';
const houseApi = 'https://api.propublica.org/congress/v1/113/house/members.json';
const url = window.location.pathname;
let api;

// Fetch Data
const getData = async () => {
  url.includes('senate') ? api = senateApi : api = houseApi;

  const members = await fetch(api, {
    method: 'GET',
    headers: {
      'X-API-Key': '1MKHPmb5ctBJaPABCBRBlH1Ijvrq7FS1dqTwsLJE',
    },
  })
    .then(res => res.json())
    .then(json => json.results[0].members)
    .catch(err => console.log(err));
  hideLoader();

  // function calling for different pages
  if (url === '/senate_data.html' || url === '/house_data.html') {
    createSelectOptions(members);
    createTable(members);
    democratCheckbox.onchange = () => createTable(filterMembers(members));
    republicanCheckbox.onchange = () => createTable(filterMembers(members));
    independantCheckbox.onchange = () => createTable(filterMembers(members));
    select.onchange = () => createTable(filterMembers(members));
  } else if (url === '/senate_attendance_statistics.html' || url === '/house_attendance_statistics.html') {

  }
};
getData();


// Create main table
const createTable = members => {
  table.innerHTML = " ";
  members.forEach(member => {
    let fullName;
    member.middle_name == null ? fullName = `${member.last_name}, ${member.first_name}` : fullName = `${member.last_name}, ${member.middle_name} ${member.first_name}`;
    const row = table.insertRow();
    row.insertCell().innerHTML = `<a href=${member.url}>${fullName}<a>`;
    row.insertCell().innerHTML = member.party;
    row.insertCell().innerHTML = member.state;
    row.insertCell().innerHTML = member.seniority;
    row.insertCell().innerHTML = `${member.votes_with_party_pct.toFixed(2)}%`;
  })
};

// Create state select options
const createSelectOptions = arr => {
  let states = [];
  arr.forEach(item => {
    states.push(item.state);
  })
  uniqueStates = [...new Set(states)].sort();
  uniqueStates.forEach(state => {
    const option = document.createElement('option');
    select.appendChild(option).innerHTML = state;
  })
};


// filter members by state and party
const filterMembers = members => {
  let filteredMembers = [];
  members.forEach(member => {
    if (member.state == select.value || select.value == 'all') {
      if (member.party == "R" && republicanCheckbox.checked) {
        filteredMembers.push(member);
      }
      if (member.party == "D" && democratCheckbox.checked) {
        filteredMembers.push(member);
      }
      if (member.party == "I" && independantCheckbox.checked) {
        filteredMembers.push(member);
      }
    }
  })
  if (filteredMembers.length == 0) {
    noResults.innerHTML = 'No results were found';
  } else {
    noResults.innerHTML = '';
    return filteredMembers;
  }
};





// Function for read-more / read-less button for the Homepage.
if (url == '/index.html') {
  readMoreButton.onclick = () => {
    content.style.display = 'block';
    readMoreButton.style.display = 'none';
  };
  readLessButton.onclick = () => {
    content.style.display = 'none';
    readMoreButton.style.display = 'block';
  };
}

// hide loader
const hideLoader = () => {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('loader-image').style.display = 'none';
  document.getElementById('loading-wrap').style.display = 'block';
}






