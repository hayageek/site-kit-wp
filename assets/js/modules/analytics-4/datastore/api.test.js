/**
 * `modules/analytics-4` data store: api tests.
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
import API from 'googlesitekit-api';
import { STORE_NAME } from './constants';
import { createTestRegistry, unsubscribeFromAll } from 'tests/js/utils';

describe( 'modules/analytics-4 properties', () => {
	let registry;

	beforeAll( () => {
		API.setUsingCache( false );
	} );

	beforeEach( () => {
		registry = createTestRegistry();
		// Receive empty settings to prevent unexpected fetch by resolver.
		registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
	} );

	afterAll( () => {
		API.setUsingCache( true );
	} );

	afterEach( () => {
		unsubscribeFromAll( registry );
	} );

	describe( 'selectors', () => {
		describe( 'isAdminAPIWorking', () => {
			// TODO - better names for all tests
			it( 'should return false TODO AS PER SPEC', async () => {
				const isAdminAPIWorking = registry.select( STORE_NAME ).isAdminAPIWorking( );

				expect( isAdminAPIWorking ).toBe( false );
			} );

			it( 'should return true if at least one property with a non-empty array of properties', async () => {
				// NOTE - selector does not work for receiveGetProperty. assuming that IB knows this!
				registry.dispatch( STORE_NAME ).receiveGetProperties( [
					{
						_id: '1000',
						_accountID: '100',
						name: 'properties/1000',
						createTime: '2014-10-02T15:01:23Z',
						updateTime: '2014-10-02T15:01:23Z',
						parent: 'accounts/100',
						displayName: 'Test GA4 Property',
						industryCategory: 'TECHNOLOGY',
						timeZone: 'America/Los_Angeles',
						currencyCode: 'USD',
						deleted: false,
					},
				],
				{ accountID: 'foo-bar' },
				);

				const isAdminAPIWorking = registry.select( STORE_NAME ).isAdminAPIWorking( );

				expect( isAdminAPIWorking ).toBe( true );
			} );

			it( 'should return true if has at least one property with a non-empty array of web datastreams', async () => {
				registry.dispatch( STORE_NAME ).receiveGetWebDataStreams(
					[
						{
							_id: '2000',
							_propertyID: '1000',
							name: 'properties/1000/webDataStreams/2000',
							// eslint-disable-next-line sitekit/acronym-case
							measurementId: '1A2BCD345E',
							// eslint-disable-next-line sitekit/acronym-case
							firebaseAppId: '',
							createTime: '2014-10-02T15:01:23Z',
							updateTime: '2014-10-02T15:01:23Z',
							defaultUri: 'http://example.com',
							displayName: 'Test GA4 WebDataStream',
						},
					],
					{ propertyID: 'foo-bar' }
				);

				const isAdminAPIWorking = registry.select( STORE_NAME ).isAdminAPIWorking( );

				expect( isAdminAPIWorking ).toBe( true );
			} );
		} );
	} );
} );
