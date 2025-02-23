const openSidePanelOnActionClick = () => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
};

const main = async () => {
  openSidePanelOnActionClick();
};

main();
