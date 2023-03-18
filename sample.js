// This example is taken wholesale from https://gilfink.medium.com/adding-web-interception-abilities-to-your-chrome-extension-fb42366df425
(function () {
	console.log("Hey there! I'm loading, phew.")
	const tabStorage = {};
	const networkFilters = {
		urls: ['*://*/*'],
	};

	chrome.webRequest.onBeforeRequest.addListener((details) => {
		console.log({details})
		const { tabId, requestId } = details;
		if (!tabStorage.hasOwnProperty(tabId)) {
			return;
		}

		tabStorage[tabId].requests[requestId] = {
			requestId: requestId,
			url: details.url,
			startTime: details.timeStamp,
			status: 'pending',
		};
		console.log(tabStorage[tabId].requests[requestId]);
	}, networkFilters);

	chrome.webRequest.onCompleted.addListener((details) => {
		console.log({details})
		const { tabId, requestId } = details;
		if (
			!tabStorage.hasOwnProperty(tabId) ||
			!tabStorage[tabId].requests.hasOwnProperty(requestId)
		) {
			return;
		}

		const request = tabStorage[tabId].requests[requestId];

		Object.assign(request, {
			endTime: details.timeStamp,
			requestDuration: details.timeStamp - request.startTime,
			status: 'complete',
		});
		console.log(tabStorage[tabId].requests[details.requestId]);
	}, networkFilters);

	chrome.webRequest.onErrorOccurred.addListener((details) => {
		console.log({details})
		const { tabId, requestId } = details;
		if (
			!tabStorage.hasOwnProperty(tabId) ||
			!tabStorage[tabId].requests.hasOwnProperty(requestId)
		) {
			return;
		}

		const request = tabStorage[tabId].requests[requestId];
		Object.assign(request, {
			endTime: details.timeStamp,
			status: 'error',
		});
		console.log(tabStorage[tabId].requests[requestId]);
	}, networkFilters);

	chrome.tabs.onActivated.addListener((tab) => {
		console.log({tab})
		const tabId = tab ? tab.tabId : chrome.tabs.TAB_ID_NONE;
		if (!tabStorage.hasOwnProperty(tabId)) {
			tabStorage[tabId] = {
				id: tabId,
				requests: {},
				registerTime: new Date().getTime(),
			};
		}
	});
	chrome.tabs.onRemoved.addListener((tab) => {
		console.log({tab})
		const tabId = tab.tabId;
		if (!tabStorage.hasOwnProperty(tabId)) {
			return;
		}
		tabStorage[tabId] = null;
	});
})();