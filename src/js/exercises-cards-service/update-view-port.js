function updateViewPort(){
    const view_port = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    return view_port;
}

export {updateViewPort}