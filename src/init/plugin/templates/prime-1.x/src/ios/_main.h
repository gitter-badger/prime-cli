#import <Cordova/CDV.h>

@interface <%= mainFileName %> : CDVPlugin

- (void) greet:(CDVInvokedUrlCommand*)command;

@end