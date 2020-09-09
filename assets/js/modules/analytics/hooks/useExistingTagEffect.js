/**
 * Analytics useExistingTag custom hook.
 *
 * Sets the accountID and property if there is an existing tag.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
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
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME } from '../datastore/constants';
import { STORE_NAME as CORE_MODULES } from '../../../googlesitekit/modules/datastore/constants';
import { STORE_NAME as MODULE_TAGMANAGER } from '../../tagmanager/datastore/constants';
const { useSelect, useDispatch } = Data;

export default function useExistingTagEffect() {
	const { setAccountID, selectProperty } = useDispatch( STORE_NAME );

	const {
		accountID,
		hasExistingTag,
		existingTag,
		existingTagAccountID,
		gtmAnalyticsPropertyID,
		gtmAnalyticsAccountID,
		gtmModuleActive,
	} = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		const tag = store.getExistingTag() || {};
		const propertyID = select( MODULE_TAGMANAGER ).getSingleAnalyticsPropertyID();

		return {
			accountID: store.getAccountID(),
			hasExistingTag: store.hasExistingTag(),
			existingTag: tag,
			existingTagAccountID: store.getTagPermission( tag )?.accountID,
			gtmAnalyticsPropertyID: propertyID,
			gtmAnalyticsAccountID: store.getTagPermission( propertyID )?.accountID,
			gtmModuleActive: select( CORE_MODULES ).isModuleActive( 'tagmanager' ),
		};
	} );

	useEffect( () => {
		if ( hasExistingTag && existingTagAccountID && existingTagAccountID !== accountID ) {
			// There is an existing Analytics tag, select it.
			setAccountID( existingTagAccountID );
			selectProperty( existingTag );
		} else if ( gtmModuleActive && gtmAnalyticsPropertyID && gtmAnalyticsAccountID && gtmAnalyticsAccountID !== accountID ) {
			// GTM container has GA tag and user has access to it, force select it.
			setAccountID( gtmAnalyticsAccountID );
			selectProperty( gtmAnalyticsPropertyID );
		}
	}, [ accountID, hasExistingTag, existingTag, existingTagAccountID, gtmAnalyticsPropertyID, gtmAnalyticsAccountID, gtmModuleActive ] );
}
