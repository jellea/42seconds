//
//  FTSViewController.m
//  42sec
//
//  Created by Joshua Peper on 01-12-12.
//  Copyright (c) 2012 Joshua Peper. All rights reserved.
//

#import "FTSViewController.h"

@interface FTSViewController ()

@end

@implementation FTSViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    CGRect screenRect = [[UIScreen mainScreen] bounds];
    CGFloat screenWidth = screenRect.size.width;
    CGFloat screenHeight = screenRect.size.height;
	// Do any additional setup after loading the view, typically from a nib.
    UIWebView *webView = [[UIWebView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, screenHeight)];
    // UIWebView *webView = [[UIWebView alloc] init];
    [webView setDelegate:self];
    
    NSString *urlAddress = @"http://fortytwoapp.com";
    NSURL *url = [NSURL URLWithString:urlAddress];
    NSURLRequest *requestObj = [NSURLRequest requestWithURL:url];
    [webView loadRequest:requestObj];
    
    [self.view addSubview:webView];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
