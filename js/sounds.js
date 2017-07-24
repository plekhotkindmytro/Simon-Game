var Sounds = function () {
    var source1 = null;
    var source2 = null;
    var source3 = null;
    var source4 = null;

    function finishedLoading(bufferList) {
        source1 = context.createBufferSource();
        source1.buffer = bufferList[0];
        source1.connect(context.destination);
        source1.start(0);
    }

    var context = new AudioContext();
    var bufferLoader = new BufferLoader(context, ["../music/simonSound1.mp3", "../music/simonSound2.mp3", "../music/simonSound3.mp3", "../music/simonSound4.mp3"], finishedLoading);
    bufferLoader.load();

}

new Sounds();
