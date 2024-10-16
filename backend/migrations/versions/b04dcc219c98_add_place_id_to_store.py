"""Add place_id to Store

Revision ID: b04dcc219c98
Revises: f768c0f376f7
Create Date: 2024-10-16 13:45:13.990371

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b04dcc219c98'
down_revision = 'f768c0f376f7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('store', sa.Column('place_id', sa.String(length=255), nullable=True))
    op.create_unique_constraint(None, 'store', ['place_id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'store', type_='unique')
    op.drop_column('store', 'place_id')
    # ### end Alembic commands ###
