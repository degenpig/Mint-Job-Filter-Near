use crate::*;

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn nft_mint(
        &mut self, role: String, image: String
    ) {
        if (env::block_timestamp() / 1000000) < 1651651200000 {
            env::panic(b"Not time for WL mint");
        }

        assert!(self.token_metadata_by_id.len() < 100, "Minting ended");
        let mut royalty = HashMap::new();
        let account_id = env::predecessor_account_id();

        let amount = env::attached_deposit();

        if amount == 4000000000000000000000000 {
            let initial_storage_usage = env::storage_usage();
            let token = Token {
                owner_id: account_id,
                approved_account_ids: Default::default(),
                next_approval_id: 0,
                royalty,
            };
            let token_id = (self.token_metadata_by_id.len() + 1).to_string();

            assert!(
                self.tokens_by_id.insert(&token_id, &token).is_none(),
                "Token already exists"
            );
            let mut title = "".to_string();
            let mut description = "".to_string();

            title = role.clone() + &"#".to_owned() + &token_id;
            description = role.clone() + &"NFTs minted by instructor and send to students who passed the study course.".to_owned();
            
            
            self.token_metadata_by_id.insert(&token_id, &TokenMetadata{
                title: Some(title.to_string()),
                description: Some(description.to_string()),
                media: Some(image),
                media_hash: None,
                copies: None,
                issued_at: Some(env::block_timestamp() / 1000000),
                expires_at: None,
                starts_at: None,
                updated_at: None,
                extra: None,
                reference: Some(token_id.clone() + ".json"),
                reference_hash: None
            });
            
            self.internal_add_token_to_owner(&token.owner_id, &token_id);
            
            // Construct the mint log as per the events standard.
            let nft_mint_log: EventLog = EventLog {
                // Standard name ("nep171").
                standard: NFT_STANDARD_NAME.to_string(),
                // Version of the standard ("nft-1.0.0").
                version: NFT_METADATA_SPEC.to_string(),
                // The data related with the event stored in a vector.
                event: EventLogVariant::NftMint(vec![NftMintLog {
                    // Owner of the token.
                    owner_id: token.owner_id.to_string(),
                    // Vector of token IDs that were minted.
                    token_ids: vec![token_id],
                    // An optional memo to include.
                    memo: None,
                }]),
            };
            env::log_str(&nft_mint_log.to_string());
        } else {
            env::panic(b"Require correct amount of Near attached");
        }
    }
}