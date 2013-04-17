// Revised Block handling.
//
// Nearly all the block is defined in the HTML and DOM
// This file helps to initialize the block DOM, and provide
// support routines
//
// Block(obj) -> Block element
// scriptForId(scriptid) -> script template
// nextSeqNum() -> int
// registerSeqNum(int) make sure we don't re-use sequence numbers
// Socket(json) -> Socket element

(function(wb){

    var elem = wb.elem;


    var _nextSeqNum = 0;

    var newSeqNum = function(){
        _nextSeqNum++;
    return _nextSeqNum;
};

    var registerSeqNum = function(seqNum){
        // When reifying saved blocks, call this for each block to make sure we start new blocks
        // that do not overlap with old ones.
        if (!seqNum) return;
        seqNum = Math.max(parseInt(seqNum, 10), _seqNum);
    }

    var blockRegistry = {};

    var registerBlock(blockdesc){
        if (blockdesc.seqNum){
            registerSeqNum(blockdesc.seqNum);
        }else{
            blockdesc.seqNum = newSeqNum();
        }
        if (! blockdesc.id){
            blockdesc.id = uuid();
        }
        blockRegistry[blockdec.id] = blockdesc;
    }

    var getHelp(id){
        return blockRegistry[id].help;
    }

    var getScript(id){
        return blockRegistry[id].script;
    }

    var getSockets(id, instance){
        return blockingRegistry[id].sockets.map(function(s,idx){
            var custom = instance[idx];
            if (custom.text && custom.text !== s.text){
                return {
                    text: custom.text,
                    type: s.type,
                    default: s.default
                }
            return s;
        });
    }

    function Block(obj){
        // FIXME:
        // Handle values coming from serialized (saved) blocks
        // Handle customized names (sockets)
        registerBlock(obj);
        return elem(
            'div',
            {
                'class': function(a){
                    var names = ['block', a.group, a.blocktype];
                    if (a.blocktype === 'context'){
                        names.push('step');
                    }else if (a.blocktype === 'eventhandler'){
                        names.push('step');
                        names.push('context');
                    }
                    return names.join(' ');
                },
                'data-blocktype': a.blocktype,
                'id': a.id,
                'data-scopeid': a.scopeid || 0,
                'data-scriptid': a.scriptid,
                'title': a.help || getHelp(a.scriptid)
            },
            [
                ['div', {'class': 'label'}, getSockets(a.scriptid, a.sockets).map(Socket)], // how to get values for restored classes?
                ['div', {'class': 'contained'}, (a.contained || []).map(Block)]
            ]
        );
    }

    function Socket(obj){
        // Sockets are described by text, type, and default value
        // type and default value are optional, but if you have one you must have the other
        // If the type is choice it must also have a choicename for the list of values
        // that can be found in the wb.choiceLists
        //
        // If a Socket only has text, it can be a string (maybe???)
    }


    wb.Block = Block;
    wb.registerSeqNum = registerSeqNum;

})(wb);
