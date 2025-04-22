export function initWebSocket(symbol, onPriceUpdate) {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
  
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const price = parseFloat(msg.p);
      onPriceUpdate(price);
    };
  
    return ws;
  }  