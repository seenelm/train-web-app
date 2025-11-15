import { datadogRum } from '@datadog/browser-rum';

const environment = import.meta.env.MODE || 'staging';

// Only initialize Datadog in production/staging, not in development
if (environment !== 'development') {
    datadogRum.init({
        applicationId: 'a59ce99b-cfb0-4e1f-b0e4-ddad59425492',
        clientToken: 'pub0984cbc78edccf0c2d7ea09348aa6e90',
        site: 'us5.datadoghq.com',
        service: 'frontend',
        env: environment,
        
        // Specify a version number to identify the deployed version of your application in Datadog
        version: '0.0.1',
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        defaultPrivacyLevel: 'mask-user-input',
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        enableExperimentalFeatures: ['clickmap'],
        
        // Enable trace correlation with backend
        allowedTracingUrls: [
            { match: 'https://api.trainapp.io', propagatorTypes: ['tracecontext', 'datadog'] },
            // Add other backend URLs as needed
            // { match: /https:\/\/.*\.trainapp\.io/, propagatorTypes: ['tracecontext', 'datadog'] },
        ],
    });

    console.log('✅ Datadog RUM initialized successfully');
} else {
    console.log('ℹ️ Datadog RUM disabled in development mode');
}

export { datadogRum };
