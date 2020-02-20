<template>
    <div class="flow-node ui-draggable panel" style="left:'+n.left+';top:'+n.top+';">
        <div class="flow-node-containter">
            <span class="moduleid">'+pad(n.id, 5)+'</span>
            <button type="button" class="close" onclick="" aria-label="Close">
                <i class="glyphicon glyphicon-remove"></i>
            </button>
            <div class="flow-node-text">
                <span class="font-size-12">&nbsp;</span>
            <h4 class="margin-top-5 font-size-16 mdname" contenteditable="true">'+n.name+'</h4>
            <ul class="node-contact">
                <button onclick="" class="btn btn-sm btn-danger hide" data-content="This is a warnning message button." data-trigger="hover" data-toggle="popover" tabindex="0" title="" type="button" data-original-title="">
                    <i class="glyphicon glyphicon-alert" aria-hidden="true"></i>
                </button>
                <button class="btn btn-sm btn-primary mdedit" data-target="#configureModule" data-toggle="modal" data-id="'+pad(n.id, 5)+'" onclick="" type="button">
                    <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> 內容
                </button>
                <button class="btn btn-sm btn-default" onclick="" type="button">
                    <span class="glyphicon glyphicon-console" aria-hidden="true"></span>
                </button>
            </div>
        </div>
    </div>
</template>