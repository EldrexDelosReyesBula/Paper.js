
    const state = papyr.state([1, 2, 3]);
    const list = papyr.for(state, (item, index) => papyr.div('Item ' + item));
    console.log(list.children.length === 3 ? 'SUCCESS: 3 items' : 'FAILED: ' + list.children.length);
    state.value = [1, 2];
    console.log(list.children.length === 2 ? 'SUCCESS: 2 items' : 'FAILED: ' + list.children.length);
    