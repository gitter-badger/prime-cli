#include "<%= mainFileName %>.h"
#include <cordova.h>

<%= mainFileName %>::<%= mainFileName %>(Cordova *cordova): CPlugin(cordova), _eventCb(0) {

}

void <%= mainFileName %>::greet(int, int) {
    m_cordova->execQML("CordovaWrapper.global.inappbrowser.visible = true");
}