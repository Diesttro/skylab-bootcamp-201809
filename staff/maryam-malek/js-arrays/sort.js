function sort(arr) {
    // function splice(arr, start, count) {
    //     var newArr = arr;
    //     var cutArr = [];
    //     var sta = start;
    //     for(i=0;i<count; i++){
    //         cutArr[i] = arr[start];
    //         start++;
    //     }
    //     if((sta + count) < arr.length){
    //         for(var x=sta; x<(arr.length-count); x++){
    //             newArr[sta] = arr[sta+count];
    //             newArr.length = arr.length - count;
    //         }
    //     }
    //     return cutArr;
    // }
    var orderArr = [];
    var index = -1;
    for(var x=0; x<arr.length; x++){
        orderArr[x] = arr[x];
    }
    debugger;
    for(i=0; i<arr.length; i++){
        for(var x=0; x<arr.length; x++){
            if(orderArr[i] >= arr[x]){
                orderArr[i] = arr[x];

            }
            index = x;
        }
        if(index = -1){
            index = i;            
        }
        arr.splice(index, 1);
    }
    return orderArr;
     
}

