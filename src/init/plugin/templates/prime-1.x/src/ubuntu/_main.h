#ifndef <%= mainFileNameUpper %>_H
#define <%= mainFileNameUpper %>_H

#include <cplugin.h>
class <%= mainFileName %>: public CPlugin {

public:
    <%= mainFileName %>(Cordova *cordova);

public slots:
    void greet();

private:
    int _eventCb;

}

#endif