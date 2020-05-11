const readMoreButton = document.getElementById('read-more-btn');
const readLessButton = document.getElementById('read-less-btn');
const content = document.getElementById('content');
const table = document.getElementById('table-body');
const table2 = document.getElementById('table-2');
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

  // function calling for different pages
  url !== '/index.html' ? hideLoader() : null;
  if (url === '/senate_data.html' || url === '/house_data.html') {
    createSelectOptions(members);
    createMainTable(members);
    democratCheckbox.onchange = () => createMainTable(filterMembers(members));
    republicanCheckbox.onchange = () => createMainTable(filterMembers(members));
    independantCheckbox.onchange = () => createMainTable(filterMembers(members));
    select.onchange = () => createMainTable(filterMembers(members));
  } else if (url === '/senate_attendance.html' || url === '/house_attendance.html') {
    partyStatisticsTable(members);
    createAttendanceTables(test(members), 'table-1', true, 'missed_votes', 'missed_votes_pct');
    createAttendanceTables(test(members), 'table-2', false, 'missed_votes', 'missed_votes_pct');
  }
};
getData();

const test = (members) => {
  return members;
}
const createAttendanceTables = (arr, table, boolean, stats1, stats2) => {
  const tableToCreate = document.getElementById(table);
  if (boolean) {
    sortedArray = [...arr].sort((a, b) => {
      return b[stats2] - a[stats2];
    })
  } else {
    sortedArray = [...arr].sort((a, b) => {
      return a[stats2] - b[stats2];
    })
  }
  sortedArray.forEach(member => {
    const row = tableToCreate.insertRow();
    row.insertCell().innerHTML = member.first_name;
    row.insertCell().innerHTML = member[stats1];
    row.insertCell().innerHTML = member[stats2].toFixed(2);
  })
}

// get party statistics
const partyStatisticsTable = array => {
  let nrRep = 0;
  let nrDem = 0;
  let nrInd = 0;
  const repVotes = [];
  const demVotes = [];
  const indVotes = [];
  array.map(item => {
    if (item.party === 'R') {
      nrRep++;
      repVotes.push(item.votes_with_party_pct);
    }
    if (item.party === 'D') {
      nrDem++;
      demVotes.push(item.votes_with_party_pct);
    }
    if (item.party === 'I') {
      nrInd++;
      indVotes.push(item.votes_with_party_pct);
    }
  })
  document.getElementById('nr-rep').innerHTML = nrRep;
  document.getElementById('nr-dem').innerHTML = nrDem;
  document.getElementById('nr-ind').innerHTML = nrInd;
  document.getElementById('pct-rep').innerHTML = getAverage(repVotes);
  document.getElementById('pct-dem').innerHTML = getAverage(demVotes);
  document.getElementById('pct-ind').innerHTML = getAverage(indVotes);
}

// get the average of an array and round down to 2 decimals helper function
const getAverage = arr => {
  if (arr.length === 0) {
    return 0;
  } else {
    const total = arr.reduce((a, b) => a + b, 0) / arr.length;
    return total.toFixed(2);
  }
}

// Create main table
const createMainTable = members => {
  table.innerHTML = " ";
  members.forEach(member => {
    let middleName;
    member.middle_name ? middleName = member.middle_name : middleName = '';
    const row = table.insertRow();
    row.insertCell().innerHTML = `<a href=${member.url}>${member.last_name}, ${member.first_name} ${middleName}<a>`;
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






