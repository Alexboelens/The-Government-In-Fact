const readMoreButton = document.getElementById('read-more-btn');
const readLessButton = document.getElementById('read-less-btn');
const content = document.getElementById('content');
const select = document.getElementById('state-select');
const republicanCheckbox = document.getElementById('republican');
const independantCheckbox = document.getElementById('independant');
const democratCheckbox = document.getElementById('democrat');
const noResults = document.getElementById('no-results');
const senateApi = 'https://api.propublica.org/congress/v1/113/senate/members.json';
const houseApi = 'https://api.propublica.org/congress/v1/113/house/members.json';
const url = window.location.pathname;

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
  if (!url.includes('index') || url.length != 24) {
    hideLoader();
  }
  if (url.includes('data')) {
    createSelectOptions(members);
    createMainTable(members);
    republicanCheckbox.onchange = () => createMainTable(filterMembers(members));
    democratCheckbox.onchange = () => createMainTable(filterMembers(members));
    democratCheckbox.onchange = () => createMainTable(filterMembers(members));
    select.onchange = () => createMainTable(filterMembers(members));
  } else if (url.includes('attendance')) {
    partyStatisticsTable(members);
    createTables(tenPct(sortArray(members, 'bottom', 'missed_votes_pct')), 'table-1', 'missed_votes', 'missed_votes_pct');
    createTables(tenPct(sortArray(members, 'top', 'missed_votes_pct')), 'table-2', 'missed_votes', 'missed_votes_pct');
  } else if (url.includes('loyalty')) {
    partyStatisticsTable(members);
    createTables(tenPct(sortArray(members, 'top', 'votes_with_party_pct')), 'table-1', 'total_votes', 'votes_with_party_pct');
    createTables(tenPct(sortArray(members, 'bottom', 'votes_with_party_pct')), 'table-2', 'total_votes', 'votes_with_party_pct');
  }
};
getData();

// get 10% of the array and the values that are the same as the end of the array
const tenPct = arr => {
  const tenPctArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i < arr.length * 0.1) {
      tenPctArray.push(arr[i]);
    } else if (tenPctArray[tenPctArray.length - 1] === arr[i]) {
      tenPctArray.push(arr[i]);
    } else {
      break;
    }
  }
  return tenPctArray;
}

// sort array asc or desc
const sortArray = (arr, topOrBot, stats) => {
  if (topOrBot === 'bottom') {
    sortedArray = arr.sort((a, b) => {
      return b[stats] - a[stats];
    })
  } else {
    sortedArray = arr.sort((a, b) => {
      return a[stats] - b[stats];
    })
  }
  return sortedArray;
}

// create attendance and loyalty tables
const createTables = (arr, table, stats1, stats2) => {
  const tableToCreate = document.getElementById(table);
  arr.forEach(member => {
    member.middle_name ? middleName = member.middle_name : middleName = '';
    const row = tableToCreate.insertRow();
    row.insertCell().innerHTML = `${member.last_name}, ${member.first_name} ${middleName}`
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
  const totalPct = [];
  array.map(item => {
    totalPct.push(item.votes_with_party_pct);
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
  document.getElementById('total').innerHTML = nrRep + nrDem + nrInd;
  document.getElementById('total-pct').innerHTML = getAverage(totalPct);
}

// get the average of an array and round down to 2 decimals
const getAverage = arr => {
  if (arr.length === 0) {
    return 0;
  } else {
    const total = arr.reduce((a, b) => a + b) / arr.length;
    return total.toFixed(2);
  }
}

// Create main table
const createMainTable = members => {
  const table = document.getElementById('table-body');
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
    noResults.style.display = 'block';
    noResults.innerHTML = 'No results were found';
  } else {
    noResults.style.display = 'none';
    noResults.innerHTML = '';
    return filteredMembers;
  }
};

// Function for read-more / read-less button for the Homepage.
if (url.includes('index') || url === 'https://alexboelens.github.io/The-Government-In-Fact/') {
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






