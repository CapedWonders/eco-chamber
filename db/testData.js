const sampleEvents = [
  {
    uri: 'sample1',
    category: 'Society',
    title: "House Speaker Paul Ryan Will Not Seek Re-Election",
    summary: "House Speaker Paul Ryan will announce Wednesday that he will not run for re-election in 2018, a source familiar with the speaker's decision tells NPR. Ryan will not step down before then. There have been rumors for some time that Ryan could retire. He already passed a signature piece of legislation on taxes, something he's been focused on since he began his public career.Congress is not expected to get much, if anything, else done this year. Ryan's tenure has been something of an uneasy one" ,
    titleSource: "NPR",
    date: "2018-04-11"
  },
  {
    uri: 'sample2',
    category: 'Society',
    title: "Pope Apologizes For 'Serious Mistakes' In Handling Of Chile's Sex Abuse Scandal",
    summary: "Pope Francis arrives in St. Peter's Square at the Vatican for his weekly general audience on Wednesday.Pope Francis has acknowledged \"serious mistakes\" in his handling of Chile's sex abuse scandal and summoned the country's bishops to an emergency meeting in Rome to discuss the matter.Francis blamed a lack of \"truthful and balanced information\" for misjudging the situation concerning Bishop Juan Barros, who he appointed to the small diocese of Osorno in 2015 despite allegations that he had",
    titleSource: "NPR",
    date: "2018-04-11"
  }  
];

const sampleSources = [
  {
    title: 'Breitbart',
    uri: 'breitbart.com',
    bias: -3
  },
  {
    titleSource: 'Fox',
    uri: 'foxnews.com',
    bias: -2
  },
  {
    titleSource: 'Hill',
    uri: 'thehill.com',
    bias: -1
  },
  {
    titleSource: 'NYTimes',
    uri: 'nytimes.com',
    bias: 0
  },
  {
    titleSource: 'Vox',
    uri: 'vox.com',
    bias: 1
  },
  {
    titleSource: 'MSNBC',
    uri: 'msnbc.com',
    bias: 2
  },
  {
    titleSource: 'Huffington',
    uri: 'huffingtonpost.com',
    bias: 3
  } 
];



const sampleArticles = [
  {
    // sourceId: 1,
    // eventId: 1,
    uri: "sampleUri1",
    date: "2018-04-11",
    title:"Speaker Paul Ryan Retires: ‘This Year Will Be My Last as a Member of the House’",
    description:"House Speaker Paul Ryan revealed at a press conference that he will retire at the end of the congressional term, saying that this “year will be my last as a member of the House.”",
    body: "BODY WILL GO HERE",
    url: "http://www.breitbart.com/big-government/2018/04/11/speaker-paul-ryan-retires-year-will-last-member-house"
  },
  {
    // sourceId: 2,
    // eventId: 1,
    uri: "sampleUri2",
    date: "2018-04-11",
    title:"House Speaker Paul Ryan will not run for re-election",
    description:"House Speaker Paul Ryan, R-Wis., announced Wednesday that he is not seeking re-election in November -- a move that ends a nearly two decade career in Congress and comes as the GOP girds for a tough fight to keep control of the House this year.",
    body: "BODY WILL GO HERE",
    url: "http://www.foxnews.com/politics/2018/04/11/house-speaker-paul-ryan-wont-run-for-re-election-ap-reports.html"
  },
  {
    // sourceId: 3,
    // eventId: 1,
    uri: "sampleUri3",
    date: "2018-04-11",
    title:"Ryan to retire as Speaker in January",
    description:"Speaker Paul Ryan (R-Wis.) is retiring at the end of this Congress, ending his speakership a little more than three years after it began and as the GOP faces a possible loss of its majority this fall.",
    body: "BODY WILL GO HERE",
    url: "http://thehill.com/homenews/house/382610-ryan-announces-he-wont-seek-reelection"
  },
  {
    // id: 4,
    // sourceId: 4,
    // eventId: 1,
    uri: "sampleUri4",
    date: "2018-04-11",
    title:"Ryan Found Himself on the Margins as G.O.P. Embraces Trump",
    description:"Mr. Ryan said Wednesday that he would not seek re-election, ending a brief stint atop the House and signaling the peril that the Republican majority faces in the midterm elections",
    body: "BODY WILL GO HERE",
    url: "https://www.nytimes.com/2018/04/11/us/politics/paul-ryan-speaker.html"
  },
  {
    // id: 5,
    // sourceId: 5,
    // eventId: 1,
    uri: "sampleUri5",
    date: "2018-04-11",
    title:"Paul Ryan announces he won’t run for reelection",
    description: "Paul Ryan announced he would not run for reelection after House Republicans’ weekly gathering on Wednesday, confirming months of speculation that his time in Washington was coming to an end. He will still serve the rest of his term.",
    body: "BODY WILL GO HERE",
    url: "https://www.vox.com/policy-and-politics/2018/4/11/17225202/paul-ryan-out-retirement-announcement"
  },
  {
    // id: 6,
    // sourceId: 6,
    // eventId: 1,
    uri: "sampleUri6",
    date: "2018-04-11",
    title:"House Speaker Paul Ryan to exit stage right",
    description: "There’s been an enormous number of House Republican retirement announcements in recent months, but some are more notable than others.",
    body: "BODY WILL GO HERE",
    url: "http://www.msnbc.com/rachel-maddow-show/house-speaker-paul-ryan-exit-stage-right"   
  },
  {
    // id: 7,
    // sourceId: 7,
    // eventId: 1,
    uri: "sampleUri7",
    date: "2018-04-11",
    title:"Paul Ryan Says He Won’t Seek Re-Election",
    description: "House Speaker Paul Ryan (R-Wis.) told colleagues Wednesday morning that he will not seek re-election this year and will retire from the House in January, capping off months of rumors that he was mulling stepping down from his leadership post.",
    body: "BODY WILL GO HERE",
    url: "https://www.huffingtonpost.com/entry/paul-ryan-reelection_us_5a328e40e4b07ff75b00d34a"   
  },
  {
    // id: 8,
    // sourceId: 1,
    // eventId: 2,
    uri: "sampleUri8",
    date: "2018-04-11",
    title:"Pope Francis admits ‘serious mistakes’ in Chile sex abuse cases",
    description: "Pope Francis told bishops in Chile he feels “pain and shame” for the “crucified lives” of clergy-related sex abuse victims, saying he made “serious mistakes” in his handling of the cases.",
    body: "BODY WILL GO HERE",
    url: "http://www.breitbart.com/news/pope-francis-admits-serious-mistakes-in-chile-sex-abuse-cases"
  },
  {
    // id: 9,
    // sourceId: 2,
    // eventId: 2,
    uri: "sampleUri9",
    date: "2018-04-11",
    title:"The Latest: Pope admits 'grave errors' in Chile abuse case",
    description:"Pope Francis has admitted he made \"grave errors\" in judgment in Chile's sex abuse scandal and invited the abuse victims he had discredited to Rome to beg their forgiveness.",
    body: "BODY WILL GO HERE",
    url: "http://www.foxnews.com/world/2018/04/11/latest-pope-admits-grave-errors-in-chile-abuse-case.html"
  },
  {
    // id: 10,
    // sourceId: 3,
    // eventId: 2,
    uri: "sampleUri10",
    date: "2018-04-11",
    title:"Did not report",
    description: "Did not report",
    body: "BODY WILL GO HERE",
    url: ""
  },
  {
    // id: 11,
    // sourceId: 4,
    // eventId: 2,
    uri: "sampleUri11",
    date: "2018-04-11",
    title:"Pope Francis Admits ‘Grave Errors’ in Chile Sex Abuse Cases",
    description:"Pope Francis has apologized for “grave errors” in the handling of sexual abuse cases in Chile, where he had adamantly defended a bishop accused of covering up abuse by the country’s most notorious pedophile priest.",
    body: "BODY WILL GO HERE",
    url: "https://www.nytimes.com/2018/04/11/world/americas/pope-francis-sex-abuse-apology.html"
  },
  {
    // id: 12,
    // sourceId: 5,
    // eventId: 2,
    uri: "sampleUri12",
    date: "2018-04-11",
    title:"Did not report",
    description: "Did not report",
    body: "BODY WILL GO HERE",
    url: ""
  },
  {
    // id: 13,
    // sourceId: 6,
    // eventId: 2,
    uri: "sampleUri13",
    date: "2018-04-11",
    title:"Pope acknowledges 'grave errors' in Chilean sex abuse scandal",
    description: "Francis summoned all of Chile's bishops to the Vatican for an emergency meeting, and invited victims to the Holy See to beg their forgiveness.",
    body: "BODY WILL GO HERE",
    url: "https://www.nbcnews.com/news/world/pope-acknowledges-grave-errors-chilean-sex-abuse-scandal-n865141"   
  },
  {
    // id: 14,
    // sourceId: 7,
    // eventId: 2,
    uri: "sampleUri14",
    date: "2018-04-11",
    title:"Pope Admits He Made ‘Serious Errors’ In Handling Chile Sex Abuse Allegations",
    description: "In a rare move, the pontiff is summoning all Chilean bishops to Rome to discuss the scandal.",
    body: "BODY WILL GO HERE",
    url: "https://www.huffingtonpost.com/entry/pope-admits-serious-mistakes-chilean-abuse-scandal_us_5ace716ae4b0701783aaf630"   
  }
];

export default { sampleSources, sampleArticles, sampleEvents } ;



