class AIClient {
  static async request(endpoint, payload, options = {}) {
    const { retry = 3, timeout = 10000 } = options;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`https://dashscope.aliyuncs.com/${endpoint}`, { //change this
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this._getApiKey()}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ERR ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (retry > 0) {
        return this.request(endpoint, payload, { ...options, retry: retry - 1 });
      }
      throw new Error(`AI fail: ${error.message}`);
    }
  }

  static async _getApiKey() {
    //const result = await chrome.storage.local.get('api_key');
    return ''; //add your key here
  }
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ai_call') {
    (async () => {
      try {
        const result = await AIClient.request(request.endpoint, request.data);
        sendResponse({ success: true, data: result });
      } catch (error) {
        sendResponse({
          success: false,
          error: error.message,
          code: error.code || 500
        });
      }
    })();
    return true;
  }
});
