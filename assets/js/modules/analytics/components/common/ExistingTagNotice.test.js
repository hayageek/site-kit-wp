/**
 * Analytics Existing Tag Notice component tests.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import ExistingTagNotice from './ExistingTagNotice';
import {
	render,
	// act
} from '../../../../../../tests/js/test-utils';
import { untilResolved } from '../../../../../../tests/js/utils';
import { MODULES_ANALYTICS } from '../../datastore/constants';
import * as analytics4Fixtures from '../../../analytics-4/datastore/__fixtures__';
import { MODULES_ANALYTICS_4 } from '../../../analytics-4/datastore/constants';
import * as fixtures from '../../datastore/__fixtures__';
import { CORE_SITE } from '../../../../googlesitekit/datastore/site/constants';

const {
	createProperty,
} = analytics4Fixtures;

const accountID = createProperty._accountID;
const { accounts, properties: propertiesUA, profiles } = fixtures.accountsPropertiesProfiles;
const propertyIDua = propertiesUA[ 0 ].id;

const features = [ 'ga4setup' ];

const {
	// id,
	webPropertyId: propertyID, // eslint-disable-line sitekit/acronym-case
	// accountId: accountID, // eslint-disable-line sitekit/acronym-case
} = fixtures.propertiesProfiles.profiles[ 0 ];

// TODO - just to populate everything before writing tests
const setupRegistryPopulateEverythingDemo = ( { dispatch } ) => {
	dispatch( CORE_SITE ).receiveSiteInfo( { homeURL } );

	dispatch( MODULES_ANALYTICS ).receiveGetSettings( { accountID } );
	dispatch( MODULES_ANALYTICS ).receiveGetExistingTag( 'UA-12345678-1' );

	dispatch( MODULES_ANALYTICS ).receiveGetAccounts( accounts );
	dispatch( MODULES_ANALYTICS ).finishResolution( 'getAccounts', [] );

	dispatch( MODULES_ANALYTICS ).receiveGetProperties( propertiesUA, { accountID } );
	dispatch( MODULES_ANALYTICS ).finishResolution( 'getProperties', [ accountID ] );

	dispatch( MODULES_ANALYTICS ).receiveGetProfiles( profiles, { accountID, propertyID: propertyIDua } );
	dispatch( MODULES_ANALYTICS ).finishResolution( 'getProfiles', [ accountID, propertyIDua ] );

	dispatch( MODULES_ANALYTICS ).setPropertyID( propertyID );
	dispatch( MODULES_ANALYTICS_4 ).setPropertyID( propertyID );

	// Taken from GA4 webdatastreams fixtures (idea taken from  assets/js/modules/analytics-4/datastore/tags.test.js)
	dispatch( MODULES_ANALYTICS_4 ).receiveGetExistingTag( '1A2BCD346E' );
};

const homeURL = 'http://example.com';

describe( 'ExistingTagNotice', () => {
	// Still has act warnings. ignore this test for now
	it.skip( 'should not render if does not have existing tag', async () => {
		const setupRegistry = ( { dispatch } ) => {
			dispatch( CORE_SITE ).receiveSiteInfo( { homeURL } );

			dispatch( MODULES_ANALYTICS ).receiveGetSettings( { accountID } );
			dispatch( MODULES_ANALYTICS ).receiveGetExistingTag( null );

			// but flag is not enabled so why is this called?
			dispatch( MODULES_ANALYTICS_4 ).receiveGetSettings( { accountID } );
		};

		const { container, registry } = render( <ExistingTagNotice />, { setupRegistry } );

		// expect( container ).toBeEmptyDOMElement();

		// Do something to wait for async and avoid act warnings
		// act( () => {
		// 	registry.dispatch( MODULES_ANALYTICS ).setAccountID( 'w000t' );
		// 	registry.dispatch( MODULES_ANALYTICS ).finishResolution( 'getProperties', [ 'w000t' ] );
		// 	registry.dispatch( MODULES_ANALYTICS_4 ).finishResolution( 'getProperties', [ 'w000t' ] );
		// } );

		await untilResolved( registry, MODULES_ANALYTICS_4 ).getExistingTag();

		expect( container ).toBeEmptyDOMElement();
	} );

	it( 'should render default message if has tag but ga4 not enabled', async () => {
		const setupRegistry = ( { dispatch } ) => {
			dispatch( CORE_SITE ).receiveSiteInfo( { homeURL } );

			dispatch( MODULES_ANALYTICS ).receiveGetSettings( { accountID } );
			dispatch( MODULES_ANALYTICS ).receiveGetExistingTag( 'UA-12345678-1' );

			// but flag is not enabled so why is this called?
			dispatch( MODULES_ANALYTICS_4 ).receiveGetSettings( { accountID } );
		};

		const { findByText } = render( <ExistingTagNotice />, { setupRegistry } );

		await findByText( /An existing Analytics tag was found on your site with the ID/ );
	} );

	/* TESTS TO CHECK OUTPUT FOR FURTHER TESTS */
	// SOON WILL HAVE TO REMOVE THESE
	it( 'should output UA existing tag', async () => {
		const { findByText } = render( <ExistingTagNotice />, { features, setupRegistry: setupRegistryPopulateEverythingDemo } );

		await findByText( 'uaexistingTag: UA-12345678-1' );
	} );

	it( 'should output UA property Id', async () => {
		const { findByText } = render( <ExistingTagNotice />, { features, setupRegistry: setupRegistryPopulateEverythingDemo } );

		await findByText( `uaPropertyID: ${ propertyID }` );
	} );

	it( 'should output GA4 existing tag', async () => {
		const { findByText } = render( <ExistingTagNotice />, { features, setupRegistry: setupRegistryPopulateEverythingDemo } );

		await findByText( 'ga4existingTag: 1A2BCD346E' );
	} );

	it( 'should output GA4 property Id', async () => {
		const { findByText } = render( <ExistingTagNotice />, { features, setupRegistry: setupRegistryPopulateEverythingDemo } );

		await findByText( `ga4PropertyID: ${ propertyID }` );
	} );
	/* END */

	// NEW FUNCTIONALITY TESTS -> TODO - describe.each?

	describe( 'If the existing UA tag is not empty but GA4 tag is empty', () => {
		// , then
		it( 'if a UA property is selected and it is the same one as indicated by the existing tag', async () => {
			// TODO - can DRY up these? get all working first
			const setupRegistry = ( { dispatch } ) => {
				dispatch( CORE_SITE ).receiveSiteInfo( { homeURL } );

				dispatch( MODULES_ANALYTICS ).receiveGetSettings( { accountID } );
				dispatch( MODULES_ANALYTICS ).receiveGetExistingTag( 'UA-12345678-1' );

				dispatch( MODULES_ANALYTICS ).receiveGetAccounts( accounts );
				dispatch( MODULES_ANALYTICS ).finishResolution( 'getAccounts', [] );

				dispatch( MODULES_ANALYTICS ).receiveGetProperties( propertiesUA, { accountID } );
				dispatch( MODULES_ANALYTICS ).finishResolution( 'getProperties', [ accountID ] );

				dispatch( MODULES_ANALYTICS ).receiveGetProfiles( profiles, { accountID, propertyID: propertyIDua } );
				dispatch( MODULES_ANALYTICS ).finishResolution( 'getProfiles', [ accountID, propertyIDua ] );

				dispatch( MODULES_ANALYTICS ).setPropertyID( 'UA-12345678-1' );
				dispatch( MODULES_ANALYTICS_4 ).setPropertyID( propertyID );
			};

			const { findByText } = render( <ExistingTagNotice />, { features, setupRegistry } );

			// Tried to do this but didn't render... order may make difference
			// const { dispatch } = registry;

			// dispatch( MODULES_ANALYTICS ).receiveGetExistingTag( 'UA-12345678-1' );

			// // TODO - check is same! not even too sure... re-read GA4?
			// dispatch( MODULES_ANALYTICS ).setPropertyID( propertyID );

			// // Need to dispatch ga4 stuff so all loads
			// dispatch( MODULES_ANALYTICS_4 ).setPropertyID( propertyID );
			// dispatch( MODULES_ANALYTICS_4 ).receiveGetExistingTag( '1A2BCD346E' );

			await findByText( `An existing Universal Analytics tag was found on your site with the ID UA-12345678-1. Since this tag refers to the same property you have selected here, Site Kit will not place its own tag and rely on the existing one. If later on you decide to remove this tag, Site Kit can place a new tag for you.` );
		} );

		it( 'if a UA property is selected and it is NOT the same one as indicated by the existing tag', async () => {
			const setupRegistry = ( { dispatch } ) => {
				dispatch( CORE_SITE ).receiveSiteInfo( { homeURL } );

				dispatch( MODULES_ANALYTICS ).receiveGetSettings( { accountID } );
				dispatch( MODULES_ANALYTICS ).receiveGetExistingTag( 'UA-12345678-1' );

				dispatch( MODULES_ANALYTICS ).receiveGetAccounts( accounts );
				dispatch( MODULES_ANALYTICS ).finishResolution( 'getAccounts', [] );

				dispatch( MODULES_ANALYTICS ).receiveGetProperties( propertiesUA, { accountID } );
				dispatch( MODULES_ANALYTICS ).finishResolution( 'getProperties', [ accountID ] );

				dispatch( MODULES_ANALYTICS ).receiveGetProfiles( profiles, { accountID, propertyID: propertyIDua } );
				dispatch( MODULES_ANALYTICS ).finishResolution( 'getProfiles', [ accountID, propertyIDua ] );

				dispatch( MODULES_ANALYTICS ).setPropertyID( 'UA-12121212-1' );
				dispatch( MODULES_ANALYTICS_4 ).setPropertyID( propertyID );
			};

			const { findByText } = render( <ExistingTagNotice />, { features, setupRegistry } );

			// so we know both are the same
			// await findByText( 'uaexistingTag: UA-12345678-1' );
			// await findByText( `uaPropertyID: UA-12121212-1` );

			await findByText( 'An existing Universal Analytics tag was found on your site with the ID UA-12345678-1.' );
		} );
	} );

	describe( 'If the existing GA4 tag is not empty but UA tag is empty', () => {
		it( 'If a GA4 property is selected and it is the same one as indicated by the existing tag:', async () => {
			const setupRegistry = ( { dispatch } ) => {
				dispatch( CORE_SITE ).receiveSiteInfo( { homeURL } );

				dispatch( MODULES_ANALYTICS ).receiveGetSettings( { accountID } );
				dispatch( MODULES_ANALYTICS ).receiveGetExistingTag( null );

				dispatch( MODULES_ANALYTICS ).receiveGetAccounts( accounts );
				dispatch( MODULES_ANALYTICS ).finishResolution( 'getAccounts', [] );

				dispatch( MODULES_ANALYTICS ).receiveGetProperties( propertiesUA, { accountID } );
				dispatch( MODULES_ANALYTICS ).finishResolution( 'getProperties', [ accountID ] );

				dispatch( MODULES_ANALYTICS ).receiveGetProfiles( profiles, { accountID, propertyID: propertyIDua } );
				dispatch( MODULES_ANALYTICS ).finishResolution( 'getProfiles', [ accountID, propertyIDua ] );

				dispatch( MODULES_ANALYTICS_4 ).setPropertyID( '1A2BCD346E' );

				// Taken from GA4 webdatastreams fixtures (idea taken from  assets/js/modules/analytics-4/datastore/tags.test.js)
				dispatch( MODULES_ANALYTICS_4 ).receiveGetExistingTag( '1A2BCD346E' );
			};

			const { findByText } = render( <ExistingTagNotice />, { features, setupRegistry } );

			await findByText(
				'An existing Google Analytics 4 tag was found on your site with the ID G-1A2BCD346E. Since this tag refers to the same property you have selected here, Site Kit will not place its own tag and rely on the existing one. If later on you decide to remove this tag, Site Kit can place a new tag for you.'
			);
		} );

		it( 'If a GA4 property is selected and it is different to the existing tag', async () => {
			const setupRegistry = ( { dispatch } ) => {
				dispatch( CORE_SITE ).receiveSiteInfo( { homeURL } );

				dispatch( MODULES_ANALYTICS ).receiveGetSettings( { accountID } );
				dispatch( MODULES_ANALYTICS ).receiveGetExistingTag( null );

				dispatch( MODULES_ANALYTICS ).receiveGetAccounts( accounts );
				dispatch( MODULES_ANALYTICS ).finishResolution( 'getAccounts', [] );

				dispatch( MODULES_ANALYTICS ).receiveGetProperties( propertiesUA, { accountID } );
				dispatch( MODULES_ANALYTICS ).finishResolution( 'getProperties', [ accountID ] );

				dispatch( MODULES_ANALYTICS ).receiveGetProfiles( profiles, { accountID, propertyID: propertyIDua } );
				dispatch( MODULES_ANALYTICS ).finishResolution( 'getProfiles', [ accountID, propertyIDua ] );

				dispatch( MODULES_ANALYTICS_4 ).setPropertyID( '6E6E6E6E6E' );

				dispatch( MODULES_ANALYTICS_4 ).receiveGetExistingTag( '1A2BCD346E' );
			};

			const { findByText } = render( <ExistingTagNotice />, { features, setupRegistry } );

			await findByText(
				'An existing Google Analytics 4 tag was found on your site with the ID G-1A2BCD346E.'
			);
		} );
	} );

	// TODO - other condition
} );

